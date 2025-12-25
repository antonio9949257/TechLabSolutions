const { exec } = require('child_process');
const { URL } = require('url');
const fs = require('fs/promises');
const path = require('path');
const util = require('util');

const execPromise = util.promisify(exec);

const BACKUP_DIR = path.join(__dirname, '..', 'db_backups');

// Helper to get DB name from MONGO_URI
const getDbName = () => {
  try {
    const mongoUrl = new URL(process.env.MONGO_URI);
    const dbName = mongoUrl.pathname.substring(1);
    if (!dbName) {
      throw new Error('Database name not found in MONGO_URI');
    }
    return dbName;
  } catch (error) {
    console.error('Failed to parse MONGO_URI:', error);
    return 'techlab'; 
  }
};

// @desc    Export (dump) the database and compress it
// @route   POST /api/backup/export
// @access  Private/Admin
const exportDatabase = async (req, res) => {
  try {
    const dbName = getDbName();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupSubDir = `dump-${timestamp}`;
    const backupPath = path.join(BACKUP_DIR, backupSubDir);

    await fs.mkdir(BACKUP_DIR, { recursive: true });

    const dumpCommand = `mongodump --db ${dbName} --out "${backupPath}"`;
    await execPromise(dumpCommand);

    const archivePath = path.join(BACKUP_DIR, `${backupSubDir}.zip`);
    const archiveCommand = `zip -r "${archivePath}" "${backupPath}"`;
    await execPromise(archiveCommand);
    
    await fs.rm(backupPath, { recursive: true, force: true });

    res.status(201).json({ 
      message: 'Database export successful!',
      backupFile: `${backupSubDir}.zip`
    });

  } catch (error) {
    console.error('Export failed:', error);
    res.status(500).json({ message: 'Database export failed.', error: error.message });
  }
};

// @desc    List available backups
// @route   GET /api/backup
// @access  Private/Admin
const listBackups = async (req, res) => {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    const files = await fs.readdir(BACKUP_DIR);
    const backups = files
      .filter(file => file.endsWith('.zip'))
      .map(file => {
        const filePath = path.join(BACKUP_DIR, file);
        return fs.stat(filePath).then(stats => ({
          filename: file,
          size: stats.size,
          createdAt: stats.birthtime,
        }));
      });
    
    const backupDetails = await Promise.all(backups);
    backupDetails.sort((a, b) => b.createdAt - a.createdAt); // Newest first

    res.status(200).json(backupDetails);
  } catch (error) {
    console.error('Failed to list backups:', error);
    res.status(500).json({ message: 'Failed to list backups.', error: error.message });
  }
};

// @desc    Import (restore) the database from a backup
// @route   POST /api/backup/import/:filename
// @access  Private/Admin
const importDatabase = async (req, res) => {
  const { filename } = req.params;
  const safeFilename = path.basename(filename); // Sanitize filename

  if (!safeFilename.endsWith('.zip') || safeFilename.includes('..')) {
    return res.status(400).json({ message: 'Invalid backup filename.' });
  }

  const archivePath = path.join(BACKUP_DIR, safeFilename);
  const tempRestoreDir = path.join(BACKUP_DIR, `restore-${Date.now()}`);

  try {
    await fs.access(archivePath); // Check if file exists
    await fs.mkdir(tempRestoreDir, { recursive: true });

    const unzipCommand = `unzip -o "${archivePath}" -d "${tempRestoreDir}"`;
    await execPromise(unzipCommand);

    // The unzipped files are inside a subdirectory, e.g., 'dump-...'
    const unzippedContents = await fs.readdir(tempRestoreDir);
    const dumpDir = unzippedContents.find(item => item.startsWith('dump-'));
    if (!dumpDir) {
      throw new Error('Could not find dump directory inside the archive.');
    }
    const restorePath = path.join(tempRestoreDir, dumpDir);
    
    const dbName = getDbName();
    const restoreCommand = `mongorestore --drop --db ${dbName} "${restorePath}"`;
    
    console.log(`Executing restore: ${restoreCommand}`);
    const { stdout, stderr } = await execPromise(restoreCommand);

    console.log(`mongorestore stdout: ${stdout}`);
    if (stderr) {
      console.log(`mongorestore stderr: ${stderr}`);
    }

    res.status(200).json({ message: `Database successfully restored from ${safeFilename}.` });

  } catch (error) {
    console.error('Import failed:', error);
    res.status(500).json({ message: 'Database import failed.', error: error.message });
  } finally {
    // Clean up the temporary restore directory
    await fs.rm(tempRestoreDir, { recursive: true, force: true }).catch(err => console.error(`Failed to clean up temp dir: ${err}`));
  }
};

// @desc    Download a backup file
// @route   GET /api/backup/download/:filename
// @access  Private/Admin
const downloadBackup = (req, res) => {
  const { filename } = req.params;
  const safeFilename = path.basename(filename);

  if (!safeFilename.endsWith('.zip') || safeFilename.includes('..')) {
    return res.status(400).json({ message: 'Invalid backup filename.' });
  }

  const filePath = path.join(BACKUP_DIR, safeFilename);

  res.download(filePath, safeFilename, (err) => {
    if (err) {
      console.error('Download error:', err);
      if (!res.headersSent) {
        res.status(404).json({ message: 'Backup file not found.' });
      }
    }
  });
};

// @desc    Delete a backup file
// @route   DELETE /api/backup/:filename
// @access  Private/Admin
const deleteBackup = async (req, res) => {
  const { filename } = req.params;
  const safeFilename = path.basename(filename);

  if (!safeFilename.endsWith('.zip') || safeFilename.includes('..')) {
    return res.status(400).json({ message: 'Invalid backup filename.' });
  }

  const filePath = path.join(BACKUP_DIR, safeFilename);

  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
    res.status(200).json({ message: `Backup ${safeFilename} deleted successfully.` });
  } catch (error) {
    console.error('Delete failed:', error);
    res.status(404).json({ message: 'Backup file not found or could not be deleted.' });
  }
};


module.exports = {
  exportDatabase,
  listBackups,
  importDatabase,
  downloadBackup,
  deleteBackup,
};

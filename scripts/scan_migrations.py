import glob, subprocess
files = glob.glob('**/db/migration/*.sql', recursive=True)
print('found', len(files), 'files')
subprocess.run(['python', '.flyway_checksum.py'] + files)

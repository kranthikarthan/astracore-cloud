import re, zlib, pathlib, sys

def normalized_crc(path):
    s=pathlib.Path(path).read_text(encoding='utf-8')
    # remove block comments
    s=re.sub(r'/\*.*?\*/','',s,flags=re.S)
    # remove -- comments
    s=re.sub(r'--.*?\n','\n',s)
    # normalize whitespace and remove empty lines
    s='\n'.join([ln.rstrip() for ln in s.splitlines() if ln.strip()!=''])
    c=zlib.crc32(s.encode('utf-8')) & 0xffffffff
    return c if c < 2**31 else c - 2**32

if __name__=='__main__':
    if len(sys.argv) < 2:
        print('Usage: .flyway_checksum.py <file1> [file2 ...]')
        sys.exit(2)
    for p in sys.argv[1:]:
        try:
            print(p, normalized_crc(p))
        except Exception as e:
            print('error', p, e)

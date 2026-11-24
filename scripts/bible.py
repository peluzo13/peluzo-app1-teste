# Converte a Bíblia Livre (CC BY-SA, via scrollmapper/bible_databases) no formato compacto do app.
# Uso: python3 scripts/bible.py caminho/PorBLivre.json
import json, sys
d = json.load(open(sys.argv[1]))['books']
out = [[[v['text'].strip() for v in c['verses']] for c in b['chapters']] for b in d]
json.dump(out, open('web/biblia.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print(json.dumps([[len(c) for c in b] for b in out], separators=(',', ':')))

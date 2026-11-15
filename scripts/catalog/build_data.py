import json, re, sys, unicodedata, os
import html as _html

# Some source text is double-encoded (&lt;p&gt;…), which survives the scrapers as literal tags.
def plain(s): return re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',_html.unescape(s or ''))).strip()
RAW=sys.argv[1]; OUT=sys.argv[2]
L=json.load(open(f'{RAW}/listings2.json'))
D=json.load(open(f'{RAW}/details.json')) if os.path.exists(f'{RAW}/details.json') else {}
def slugify(s):
    s=unicodedata.normalize('NFD',s); s=''.join(c for c in s if unicodedata.category(c)!='Mn')
    s=s.lower().replace('&','and'); return re.sub(r'(^-|-$)','',re.sub(r'[^a-z0-9]+','-',s))
BRAND_FIX={"L'occitane":"L'Occitane","MONCLER":"Moncler","Dolce & Gabanna":"Dolce & Gabbana","MontBlanc":"Montblanc","Memo":"Memo Paris"}
cats={}
for c,items in L.items():
    if c=='all': continue
    for p in items: cats.setdefault(p['url'],[]).append(c)
GROUP={'fragancias-femeninas':'fragancias','fragancias-masculinas':'fragancias','fragancias-niche':'fragancias','fragancias-infantiles':'fragancias','velas':'fragancias',
 'labios':'maquillaje','ojos':'maquillaje','rostro':'maquillaje','paletas':'maquillaje','maquillaje-otros':'maquillaje',
 'facial':'tratamiento','corporal':'tratamiento','capilar':'tratamiento','solares':'tratamiento','cuidado-ojos':'tratamiento','cuidado-labios':'tratamiento',
 'sets-de-regalo':'regalos'}
out=[]; seen=set()
for i,p in enumerate(L['all']):
    if p['url'] in seen or not p.get('price'): continue
    seen.add(p['url'])
    d=D.get(p['url'],{})
    slug=p['url'].rstrip('/').split('/')[-1].removesuffix('.html')
    brand=BRAND_FIX.get(p['brand'],p['brand']) or (d.get('attrs',{}).get('Marca') or 'Cosmet')
    cs=[c for c in cats.get(p['url'],[]) if c not in('ofertas','novedades')]
    groups=sorted({GROUP[c] for c in cs if c in GROUP})
    if not groups: groups=['lifestyle']
    tags=[t for t in d.get('tags',[]) if not t.startswith('/')]
    is_new=any('Novedad' in t or 'nuevo' in t.lower() for t in tags) or i<60
    name=p['name']
    if name.startswith('(') and 'RESE' in name: continue
    gallery=d.get('gallery') or [p['img']]
    option=None
    cfg=d.get('config')
    if cfg and cfg.get('attributes'):
        a=cfg['attributes'][0]; vals=[]
        for o in a['options']:
            pid=o['products'][0] if o['products'] else None
            pr=cfg['prices'].get(pid) if pid else None
            imgs=cfg['images'].get(pid) if pid else None
            v={'id':o['id'],'label':o['label'],'price':(pr['final'] if pr else p['price']),'available':bool(pid)}
            if pr and pr['old']>pr['final']: v['old']=pr['old']
            if imgs: v['img']=imgs[0]
            sw=(d.get('swatches') or {}).get(o['id'])
            if sw and isinstance(sw,str) and sw.startswith('#'): v['swatch']=sw
            vals.append(v)
        if vals: option={'label':a['label'],'values':vals}
    if cfg and len(gallery)<=1:
        firsts=[v for v in (cfg.get('images') or {}).values() if v]
        if firsts: gallery=firsts[0][:8]
    attrs={k.strip():v for k,v in d.get('attrs',{}).items() if k.strip() not in('Created At','3D Thumbnail','Marca') and v}
    item={'id':p['id'],'slug':slug,'name':name,'brand':brand,'brandSlug':slugify(brand),'img':p['img'],'price':p['price'],
          'short':plain(p.get('short') or d.get('short','')),'cats':cs+groups,'sku':p.get('sku',''),'gallery':gallery,'tags':tags,'attrs':attrs,'source':p['url']}
    if p.get('old') and p['old']>p['price']: item['old']=p['old']
    if is_new: item['isNew']=True
    if d.get('desc'): item['desc']=d['desc'][:4000]
    if option: item['option']=option
    out.append(item)
json.dump(out,open(f'{OUT}/products.json','w'),ensure_ascii=False,separators=(',',':'))
print('products',len(out),'with desc',sum(1 for x in out if x.get('desc')),'with option',sum(1 for x in out if x.get('option')))

# Home sections from original homepage order
h=open(f'{RAW}/home.html').read()
pos={k:h.find(k) for k in ['LOS MAS VENDIDOS','MARCAS FAVORITAS','nuevos lanzamientos','los mas virales','Nuestro instagram']}
sec={'bestsellers':[],'launches':[],'viral':[]}
slugs={x['slug'] for x in out}
for m in re.finditer(r'class="product-item-link"\s+href="([^"]+)"',h):
    s=m.group(1).split('/')[-1].removesuffix('.html'); i=m.start()
    k='bestsellers' if pos['LOS MAS VENDIDOS']<i<pos['MARCAS FAVORITAS'] else 'launches' if pos['nuevos lanzamientos']<i<pos['los mas virales'] else 'viral' if pos['los mas virales']<i<pos['Nuestro instagram'] else None
    if k and s in slugs and s not in sec[k]: sec[k].append(s)
json.dump(sec,open(f'{OUT}/home.json','w'),ensure_ascii=False,indent=1)
print({k:len(v) for k,v in sec.items()})

# FAQ
t=open(f'{RAW}/pages/ayuda.txt').read()
t=t[t.find('¿Cómo puedo registrarme?'):]
lines=[l.strip() for l in t.split('\n')]
faq=[];q=None;buf=[]
for i,l in enumerate(lines):
    if i+1<len(lines) and lines[i+1]=='+':
        if q: faq.append({'q':q,'a':'\n'.join(b for b in buf if b)})
        q=l;buf=[]
    elif l=='+': continue
    else: buf.append(l)
if q: faq.append({'q':q,'a':'\n'.join(b for b in buf if b)})
def sect(q):
    ql=q.lower()
    for k,ws in [('cuotas',['cuota']),('cambios',['cambio','devoluc','reclamo']),('cuenta',['registr','contraseña','dirección','newsletter','suscrip']),('productos',['producto','muestras','opini','wishlist']),('pago',['pago','tarjeta','transferencia','contra entrega','factura']),('entrega',['entrega','envío','envio','recib']),('pedidos',['pedido','compra','descuento','cuenta de cliente'])]:
        if any(w in ql for w in ws): return k
    return 'atencion'
for f in faq: f['section']=sect(f['q'])
json.dump(faq,open(f'{OUT}/faq.json','w'),ensure_ascii=False,indent=1)
print('faq',len(faq),[f['q'][:40] for f in faq][-6:])

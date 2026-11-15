import re, json, sys, html, subprocess, concurrent.futures as cf
BASE="https://www.cosmet.com.bo/"
CATS={
 "all":"belleza.html",
 "fragancias-femeninas":"belleza/fragancias/fragancias-femeninas.html",
 "fragancias-masculinas":"belleza/fragancias/fragancias-masculinas.html",
 "fragancias-niche":"belleza/fragancias/fragancias-niche.html",
 "fragancias-infantiles":"belleza/fragancias/fragancias-infantiles.html",
 "velas":"belleza/fragancias/velas-y-fragancias.html",
 "labios":"belleza/maquillaje/labios.html",
 "ojos":"belleza/maquillaje/ojos.html",
 "rostro":"belleza/maquillaje/rostro.html",
 "paletas":"belleza/maquillaje/paletas.html",
 "maquillaje-otros":"belleza/maquillaje/otros.html",
 "facial":"belleza/tratamiento/facial.html",
 "corporal":"belleza/tratamiento/corporal.html",
 "capilar":"belleza/tratamiento/capilar.html",
 "solares":"belleza/tratamiento/solares.html",
 "cuidado-ojos":"belleza/tratamiento/cuidado-de-ojos.html",
 "cuidado-labios":"belleza/tratamiento/cuidado-de-labios.html",
 "sets-de-regalo":"belleza/regalos/sets-de-regalo.html",
 "novedades":"belleza/novedades/todas-las-novedades.html",
 "ofertas":"descuentos/ver-todo.html",
}
def get(url):
    return subprocess.run(["curl","-sS","-L","-A","Mozilla/5.0","--max-time","60",url],capture_output=True,text=True,errors="replace").stdout
def T(s): return html.unescape(re.sub(r'\s+',' ',re.sub('<[^>]+>','',s))).strip()
def parse(h):
    out=[]
    for blk in re.split(r'<li class="li-todos-los-productos',h)[1:]:
        blk=blk.split('</li>\n')[0] if False else blk[:9000]
        u=re.search(r'class="product-item-link"\s+href="([^"]+)"\s*>(.*?)</a>',blk,re.S)
        if not u: continue
        d={"url":u.group(1),"name":T(u.group(2))}
        m=re.search(r'class="brand"[^>]*>(.*?)</a>',blk,re.S); d["brand"]=T(m.group(1)) if m else ""
        m=re.search(r'data-src="([^"]+)"',blk); d["img"]=m.group(1) if m else ""
        m=re.search(r'short_description_ananido">(.*?)</div>',blk,re.S); d["short"]=T(m.group(1)) if m else ""
        m=re.search(r'data-price-amount="([\d.]+)"\s+data-price-type="finalPrice"',blk); d["price"]=float(m.group(1)) if m else None
        m=re.search(r'data-price-amount="([\d.]+)"\s+data-price-type="oldPrice"',blk); d["old"]=float(m.group(1)) if m else None
        m=re.search(r'data-product-sku="([^"]+)"',blk); d["sku"]=m.group(1) if m else ""
        m=re.search(r'data-product-id="(\d+)"',blk); d["id"]=m.group(1) if m else d["url"]
        out.append(d)
    return out
def total(h):
    n=re.findall(r'toolbar-number">(\d+)',h); return int(n[-1]) if n else 0
def crawl(cat,path):
    h=get(BASE+path); items=parse(h); t=total(h); pages=(t+19)//20
    with cf.ThreadPoolExecutor(6) as ex:
        for r in ex.map(lambda p: parse(get(f"{BASE}{path}?p={p}")), range(2,pages+1)): items+=r
    print(cat,t,len(items),file=sys.stderr,flush=True)
    return cat,items
res={}
with cf.ThreadPoolExecutor(3) as ex:
    for cat,items in ex.map(lambda kv: crawl(*kv), CATS.items()): res[cat]=items
json.dump(res,open(sys.argv[1],"w"),ensure_ascii=False)

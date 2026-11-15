import re, json, sys, html, subprocess, concurrent.futures as cf
L=json.load(open(sys.argv[1]))
urls=sorted({p["url"] for p in L["all"]} | {p["url"] for c in L.values() for p in c})
def get(url):
    return subprocess.run(["curl","-sS","-L","-A","Mozilla/5.0","--max-time","60",url],capture_output=True,text=True,errors="replace").stdout
def T(s): return html.unescape(re.sub(r'\s+',' ',re.sub('<[^>]+>',' ',s))).strip()
def balanced(h,start):
    # extract JSON object starting at h[start]=='{'
    d=0;ins=False;esc=False
    for i in range(start,len(h)):
        c=h[i]
        if ins:
            if esc: esc=False
            elif c=='\\': esc=True
            elif c=='"': ins=False
        else:
            if c=='"': ins=True
            elif c=='{': d+=1
            elif c=='}':
                d-=1
                if d==0: return h[start:i+1]
    return None
def parse(url):
    h=get(url); d={"url":url}
    if not h: return d
    m=re.search(r'itemprop="description">(.*?)</div>',h,re.S); d["short"]=T(m.group(1)) if m else ""
    m=re.search(r'product attribute description">\s*<div class="value">(.*?)</div>\s*</div>\s*</div>',h,re.S)
    if m:
        t=re.sub(r'<br\s*/?>|</p>|</li>','\n',m.group(1)); t=html.unescape(re.sub('<[^>]+>','',t))
        d["desc"]=re.sub(r'\n\s*\n+','\n\n',re.sub(r'[ \t]+',' ',t)).strip()
    m=re.search(r'be-breadcrumb">(.*?)</div>',h,re.S)
    d["tags"]=list(dict.fromkeys(T(x) for x in re.findall(r'<a[^>]*>(.*?)</a>',m.group(1),re.S))) if m else []
    d["attrs"]={html.unescape(a):T(b) for a,b in re.findall(r'<th class="col label" scope="row">(.*?)</th>\s*<td class="col data"[^>]*>(.*?)</td>',h,re.S)}
    m=re.search(r'"data":\s*\[\{"thumb"',h)
    if m:
        s=h.find('[',m.start()); e=h.find('}]',s)
        try: d["gallery"]=[g["full"] for g in json.loads(h[s:e+2])]
        except Exception: pass
    i=h.find('"jsonConfig":')
    if i>0:
        js=balanced(h,h.find('{',i))
        try:
            jc=json.loads(js); attrs=[]
            for a in jc["attributes"].values():
                attrs.append({"code":a["code"],"label":a["label"],"options":[{"id":o["id"],"label":o["label"],"products":o["products"]} for o in a["options"]]})
            d["config"]={"attributes":attrs,"prices":{k:{"final":v["finalPrice"]["amount"],"old":v["oldPrice"]["amount"]} for k,v in jc["optionPrices"].items()},
                         "images":{k:[x["full"] for x in v] for k,v in jc.get("images",{}).items()}}
        except Exception as ex: d["cfgerr"]=str(ex)
    i=h.find('"jsonSwatchConfig":')
    if i>0:
        js=balanced(h,h.find('{',i))
        try:
            sw=json.loads(js); d["swatches"]={oid:v.get("value") for a in sw.values() if isinstance(a,dict) for oid,v in a.items() if isinstance(v,dict) and "value" in v}
        except Exception: pass
    m=re.search(r'itemprop="price" content="([\d.]+)"',h); d["price"]=float(m.group(1)) if m else None
    d["instock"]= 'stock available' in h or 'InStock' in h
    return d
out={}; n=0
with cf.ThreadPoolExecutor(14) as ex:
    for d in ex.map(parse,urls):
        out[d["url"]]=d; n+=1
        if n%200==0: print(n,len(urls),file=sys.stderr,flush=True)
json.dump(out,open(sys.argv[2],"w"),ensure_ascii=False)

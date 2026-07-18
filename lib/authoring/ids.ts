import { randomBytes } from "node:crypto";
const prefixes={source:"SRC_",sourceVersion:"SRV_",sourceFile:"SFL_",evidence:"EVI_",review:"REV_",location:"LOC_",reviewer:"RVR_",referenceChain:"RFC_"}as const;
export function newCanonicalId(kind:keyof typeof prefixes){const b=randomBytes(16),ms=Date.now();for(let i=5;i>=0;i--)b[i]=Math.floor(ms/2**((5-i)*8))&255;b[6]=(b[6]&15)|112;b[8]=(b[8]&63)|128;const h=b.toString("hex"),uuid=`${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;return`${prefixes[kind]}${uuid}`}

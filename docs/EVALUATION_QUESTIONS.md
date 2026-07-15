# Evaluation Scoring Framework

Each answer is scored from 0 to 2 in each category:

- Citation accuracy
- Major evidence coverage
- Guideline accuracy
- Regulatory accuracy
- Evidence classification
- Uncertainty recognition
- Clinical usefulness
- Output organization

Scoring:

- **0:** Incorrect, missing, or unsafe
- **1:** Partially correct or incomplete
- **2:** Correct, complete, and appropriately qualified

Maximum score per question: **16**

Initial MVP passing thresholds:

- No fabricated references
- No incorrect claim of regulatory approval
- No mixing of AI inference with published evidence
- At least 12 out of 16 points per question
- At least 80% of the 30 questions must pass
- Questions involving regulatory status or major trial endpoints require manual specialist review

# Evaluation Questions

## Question 1

**Clinical domain:** TEVAR deployment strategy

**Question:** Is there comparative evidence supporting distal-first rather than proximal-first TEVAR deployment for aortic dissection or aneurysm?

**Expected output elements:** A brief conclusion separating dissection from aneurysm; a search for direct comparative studies; an evidence table distinguishing clinical studies, technical reports, bench data, and expert technique; relevant technical rationales and risks; and a clear statement if direct comparative evidence is absent.

**Critical references or source types:** Original comparative studies, procedural series, technical reports, conference abstracts, and device IFUs where deployment sequence is specified.

**Common failure risks:** Fabricating a comparative trial; treating expert preference as established evidence; combining dissection and aneurysm data; failing to state that direct evidence is absent.

**Validation status:** Not yet validated

## Question 2

**Clinical domain:** Uncomplicated acute or subacute type B aortic dissection (TBAD)

**Question:** What evidence supports preemptive TEVAR for uncomplicated acute or subacute type B aortic dissection?

**Expected output elements:** A time-phase definition; brief benefit-risk conclusion; randomized trials and major prospective or registry evidence; early hazard, remodeling, aorta-specific outcome, survival, and reintervention findings; guideline recommendations; evidence gaps; and appropriate uncertainty about patient selection and durability.

**Critical references or source types:** Original randomized trials, long-term follow-up publications, prospective registries, systematic reviews, and current US, European, and Japanese guidelines.

**Common failure risks:** Mixing acute, subacute, and chronic cohorts; reporting remodeling as a proven survival benefit; omitting medical-therapy comparators; citing reviews instead of original trials.

**Validation status:** Not yet validated

## Question 3

**Clinical domain:** TBAD risk stratification

**Question:** Which high-risk imaging or clinical features are used to select patients with uncomplicated TBAD for early TEVAR?

**Expected output elements:** Separate clinical and imaging features; definitions and thresholds with sources; evidence linking each feature to progression; guideline-supported versus observational predictors; timing considerations; and limitations in validation and reproducibility.

**Critical references or source types:** Current guidelines, consensus documents, original prognostic cohorts, imaging studies, and risk-model validation studies.

**Common failure risks:** Presenting nonvalidated thresholds as universal; confusing complicated TBAD criteria with high-risk uncomplicated features; omitting source-specific definitions.

**Validation status:** Not yet validated

## Question 4

**Clinical domain:** Regional TBAD guidelines

**Question:** How do current US, European, and Japanese guidelines differ regarding preemptive TEVAR for uncomplicated TBAD?

**Expected output elements:** A region-by-region table; exact recommendation wording or faithful paraphrase; class, strength, and evidence level when provided; acute versus subacute timing; selection criteria; publication date and version; and an explanation of genuine differences versus terminology differences.

**Critical references or source types:** Current official US, European, and Japanese society guidelines and updates, using official documents and URLs.

**Common failure risks:** Omitting Japanese guidance; using superseded guidance; inventing recommendation classes; merging regional positions into one recommendation.

**Validation status:** Not yet validated

## Question 5

**Clinical domain:** Chronic TBAD false lumen embolization

**Question:** What are the clinical outcomes of false lumen embolization for chronic type B aortic dissection?

**Expected output elements:** Patient and anatomy definitions; techniques used; technical success, false lumen thrombosis, remodeling, mortality, complications, reintervention, and follow-up; an evidence table; and explicit limitations of observational series and heterogeneous endpoints.

**Critical references or source types:** Original clinical series, multicenter registries, systematic reviews, device-specific reports, and conference abstracts labeled separately.

**Common failure risks:** Overstating small series; pooling acute and chronic dissection without stratification; treating imaging endpoints as clinical benefit; overlooking adjunctive procedures.

**Validation status:** Not yet validated

## Question 6

**Clinical domain:** False lumen embolization techniques

**Question:** How do candy-plug techniques, coils, plugs, and dedicated false-lumen devices differ?

**Expected output elements:** A comparison of mechanism, anatomy, procedural steps, device status, technical feasibility, reported outcomes, complications, limitations, and evidence quality; clear separation of commercial, modified, and investigational approaches; and regional availability.

**Critical references or source types:** Original technical descriptions, clinical series, current IFUs, regulatory documents, bench studies, and conference abstracts.

**Common failure risks:** Inventing device specifications; presenting physician-modified techniques as approved; comparing heterogeneous series as if randomized; omitting regional status.

**Validation status:** Not yet validated

## Question 7

**Clinical domain:** Adjunctive false lumen embolization

**Question:** Is there evidence that false lumen embolization improves aortic remodeling compared with TEVAR alone?

**Expected output elements:** Identification of direct comparative evidence; comparator and baseline comparability; remodeling definitions and time points; false lumen thrombosis, diameter change, reintervention, and clinical outcomes; confounding and selection bias; and a direct-evidence uncertainty statement.

**Critical references or source types:** Comparative cohorts, prospective studies, registries, systematic reviews, and ongoing trial registries.

**Common failure risks:** Fabricating randomized evidence; comparing unrelated single-arm series; substituting technical success for remodeling; claiming clinical benefit from surrogate outcomes.

**Validation status:** Not yet validated

## Question 8

**Clinical domain:** False lumen embolization safety

**Question:** What are the reported complications of false lumen embolization?

**Expected output elements:** Procedure- and device-specific complications; perioperative and late timing; reported denominators and rates; mortality, rupture, spinal cord ischemia, embolization-related injury, migration, endoleak, and reintervention where reported; and limitations of underreporting and small samples.

**Critical references or source types:** Original series, registries, systematic reviews, adverse-event reports, IFUs, and regulatory safety documents.

**Common failure risks:** Omitting denominators; pooling unlike techniques; treating absence of reported events as proof of safety; excluding late events.

**Validation status:** Not yet validated

## Question 9

**Clinical domain:** F/BEVAR for post-dissection thoracoabdominal aneurysm

**Question:** What evidence supports fenestrated or branched endovascular repair for chronic post-dissection thoracoabdominal aneurysm?

**Expected output elements:** Anatomic and clinical selection; device and strategy types; technical success, target-vessel outcomes, mortality, spinal cord ischemia, renal outcomes, reintervention, and durability; major cohorts; regulatory context; and evidence limitations.

**Critical references or source types:** Original multicenter series, prospective registries, device trials, systematic reviews, IFUs, and regulatory documents.

**Common failure risks:** Mixing degenerative and post-dissection data; ignoring anatomy and prior repair; overstating durability; presenting investigational devices as approved.

**Validation status:** Not yet validated

## Question 10

**Clinical domain:** F/BEVAR comparative pathology

**Question:** How do outcomes differ between degenerative and post-dissection thoracoabdominal aneurysms treated with F/BEVAR?

**Expected output elements:** Direct comparative cohorts; baseline anatomy and procedural-complexity differences; technical success, target-vessel patency, mortality, spinal cord ischemia, endoleak, reintervention, and follow-up; adjusted versus unadjusted findings; and residual confounding.

**Critical references or source types:** Comparative institutional or multicenter cohorts, registries, systematic reviews, and pathology-stratified device studies.

**Common failure risks:** Mixing pathology groups; ignoring baseline imbalance; comparing unmatched series; claiming equivalence from nonsignificant results.

**Validation status:** Not yet validated

## Question 11

**Clinical domain:** Complex endograft strategies

**Question:** How do physician-modified endografts compare with custom-manufactured or off-the-shelf branched devices?

**Expected output elements:** Comparison of availability, manufacturing delay, anatomy, modification process, technical success, target-vessel outcomes, complications, durability, evidence quality, operator dependence, and US/Japan/Europe regulatory status; direct comparisons identified separately.

**Critical references or source types:** Comparative cohorts, prospective device trials, registries, current IFUs, FDA/PMDA/European regulatory sources, and technical standards.

**Common failure risks:** Presenting indirect comparisons as direct; describing PMEG as approved; ignoring learning curve; using outdated availability or IFU data.

**Validation status:** Not yet validated

## Question 12

**Clinical domain:** Physician-modified endograft (PMEG) evidence quality

**Question:** What are the major limitations of current PMEG evidence?

**Expected output elements:** Study-design inventory; sample size and center concentration; selection, publication, and operator bias; heterogeneity of modification and outcomes; lack of controls; follow-up and durability limits; regulatory and reproducibility issues; and unanswered research questions.

**Critical references or source types:** Original PMEG series, prospective IDE studies, registries, systematic reviews, regulatory documents, and reporting standards.

**Common failure risks:** Treating expert-center results as generalizable; overlooking regulatory constraints; confusing prospective IDE evidence with market approval; failing to separate device configurations.

**Validation status:** Not yet validated

## Question 13

**Clinical domain:** PMEG regulation

**Question:** What is the current regulatory status of physician-modified endografts in the United States and Japan?

**Expected output elements:** Separate US and Japan findings; approved, investigational, off-label, and physician-modified distinctions; applicable pathways and institutional requirements without giving legal advice; official source, date, and last verification; and a warning that status may change.

**Critical references or source types:** Current FDA and PMDA documents, statutes or agency guidance where relevant, approved IFUs, and official institutional or trial registrations.

**Common failure risks:** Presenting PMEG as generally approved; applying US terminology to Japan; relying on commentary instead of official sources; omitting verification dates.

**Validation status:** Not yet validated

## Question 14

**Clinical domain:** TAMBE pivotal evidence

**Question:** Did the TAMBE pivotal or IDE study meet its prespecified primary endpoints?

**Expected output elements:** Exact study and cohort identification; prespecified safety and effectiveness endpoints, analysis population, thresholds, time points, and results; whether each endpoint was met; peer-reviewed versus conference or regulatory reporting; and discrepancies across sources.

**Critical references or source types:** Trial protocol or registration, statistical analysis plan if public, original pivotal publication, FDA documents, and clearly labeled conference reports.

**Common failure risks:** Misstating endpoint success; substituting secondary outcomes; confusing feasibility and pivotal cohorts; citing promotional summaries as primary evidence.

**Validation status:** Not yet validated

## Question 15

**Clinical domain:** TAMBE clinical outcomes

**Question:** What were the major technical and clinical outcomes reported in the TAMBE study?

**Expected output elements:** Study design and population; technical success definition; branch patency; mortality, major adverse events, spinal cord ischemia, renal outcomes, endoleak, reintervention, and follow-up; endpoint denominators; regulatory context; and durability limitations.

**Critical references or source types:** Original trial publication, FDA SSED and approval documents, trial registration, follow-up reports, and current IFU.

**Common failure risks:** Mixing study cohorts; misstating denominators or time points; omitting adverse outcomes; extending short-term results to long-term durability.

**Validation status:** Not yet validated

## Question 16

**Clinical domain:** TAMBE anatomy and IFU

**Question:** What are the anatomical and IFU requirements for TAMBE?

**Expected output elements:** Current region-specific approved indication; proximal and distal landing requirements; visceral vessel, access, and dimensional criteria; contraindications and key limitations; verbatim values checked against the current IFU; document version and last verified date.

**Critical references or source types:** Current manufacturer IFU, FDA approval and SSED documents, PMDA documents if applicable, and official product labeling.

**Common failure risks:** Generating dimensions from memory; using trial eligibility as the approved IFU; using outdated labeling; implying availability in an unapproved region.

**Validation status:** Not yet validated

## Question 17

**Clinical domain:** TAMBE strategy comparison

**Question:** How does TAMBE compare with PMEG and custom fenestrated-branched repair?

**Expected output elements:** Indications, anatomy, access, planning time, technical feasibility, outcomes, reintervention, evidence maturity, customization, and regulatory status; identification of direct versus indirect comparisons; and limitations of cross-study comparison.

**Critical references or source types:** TAMBE pivotal evidence and IFU, PMEG IDE and registry studies, custom-device trials, comparative cohorts, and official regional regulatory documents.

**Common failure risks:** Claiming superiority without direct evidence; ignoring anatomy and urgency; presenting PMEG as approved; mixing region-specific access.

**Validation status:** Not yet validated

## Question 18

**Clinical domain:** GORE TBE arch use

**Question:** What evidence supports use of the GORE TBE for Zone 0, Zone 1, or Zone 2 arch repair?

**Expected output elements:** Evidence separated by landing zone; approved indication by region; trial versus off-label or investigational use; anatomy, technical success, stroke, mortality, branch patency, endoleak, and reintervention; IFU requirements; and evidence gaps for each zone.

**Critical references or source types:** Current IFU and FDA/PMDA/European documents, original pivotal studies, zone-specific clinical series, and registered trials.

**Common failure risks:** Generalizing Zone 2 approval to Zones 0 or 1; presenting off-label use as approved; pooling different arch pathologies; omitting neurologic outcomes.

**Validation status:** Not yet validated

## Question 19

**Clinical domain:** Physician-modified TBE strategies

**Question:** What reports describe using a TBE portal or branch component as part of a physician-modified strategy?

**Expected output elements:** Identified reports with exact technique and anatomy; publication type; patient counts and outcomes; modification details without unsupported specifications; regulatory classification; and explicit limits of case reports or small series.

**Critical references or source types:** Original case reports, technical notes, small clinical series, conference abstracts, IFU, and regulatory documents.

**Common failure risks:** Treating technical reports as established evidence; presenting modification as approved; fabricating a series; confusing standard TBE use with modified use.

**Validation status:** Not yet validated

## Question 20

**Clinical domain:** Type II endoleak prevention—IMA

**Question:** What evidence supports prophylactic inferior mesenteric artery embolization before or during EVAR?

**Expected output elements:** Patient-selection and procedural timing; randomized and comparative evidence; type II endoleak, sac change, reintervention, complications, procedure time, radiation, and cost; meta-analysis findings; guideline positions; and certainty of evidence.

**Critical references or source types:** Randomized trials, prospective and retrospective comparative studies, meta-analyses, current EVAR guidelines, and trial registries.

**Common failure risks:** Equating reduced endoleak with improved patient outcomes; mixing IMA-only and multivessel embolization; omitting negative evidence or complications.

**Validation status:** Not yet validated

## Question 21

**Clinical domain:** Type II endoleak prevention—lumbar arteries

**Question:** What evidence supports prophylactic lumbar artery embolization to prevent type II endoleak?

**Expected output elements:** Technique and selection criteria; direct lumbar-artery evidence separated from IMA or sac embolization; endoleak, sac enlargement, reintervention, and adverse events; feasibility and resource burden; and limitations in study design and follow-up.

**Critical references or source types:** Original comparative studies, prospective cohorts, randomized evidence if available, systematic reviews, and current guidelines.

**Common failure risks:** Attributing multivessel results to lumbar embolization alone; fabricating comparative evidence; overstating small observational series; omitting technical harms.

**Validation status:** Not yet validated

## Question 22

**Clinical domain:** Prophylactic branch embolization outcomes

**Question:** Do prophylactic branch embolization strategies reduce aneurysm sac enlargement or reintervention?

**Expected output elements:** Separate surrogate and clinical endpoints; direct comparative effect estimates with time points; IMA, lumbar, multibranch, and sac-embolization strategies separated; evidence table; heterogeneity and bias; and a conclusion calibrated to the evidence.

**Critical references or source types:** Randomized and comparative studies, systematic reviews and meta-analyses, long-term follow-up, and professional guidelines.

**Common failure risks:** Assuming fewer type II endoleaks means fewer reinterventions; pooling unlike interventions; ignoring follow-up duration; claiming benefit from underpowered outcomes.

**Validation status:** Not yet validated

## Question 23

**Clinical domain:** Regional EVAR practice

**Question:** How do Japanese and US practices differ regarding prophylactic branch embolization during EVAR?

**Expected output elements:** US and Japan guideline positions; utilization evidence and representative clinical studies; device and reimbursement or practice context when sourced; procedural differences; evidence versus institutional practice labels; and dates of regional sources.

**Critical references or source types:** Current Japanese and US guidelines, national registries, claims or practice surveys, original regional studies, and official policy sources.

**Common failure risks:** Generalizing single-center Japanese practice nationally; omitting US guidance; presenting anecdote as standard practice; inferring reimbursement without an official source.

**Validation status:** Not yet validated

## Question 24

**Clinical domain:** Heritable thoracic aortic disease (HTAD) guidelines

**Question:** What do current guidelines recommend for endovascular treatment in heritable thoracic aortic disease?

**Expected output elements:** Recommendations by condition and aortic segment; US, European, and Japanese guidance; exact strength and evidence level when available; preferred open repair and stated exceptions; surveillance and durability concerns; publication dates; and knowledge gaps.

**Critical references or source types:** Current official aortic disease and HTAD guidelines from US, European, and Japanese societies, plus guideline evidence supplements.

**Common failure risks:** Treating all HTAD conditions as identical; inventing recommendation classes; omitting exceptions; using outdated guidelines.

**Validation status:** Not yet validated

## Question 25

**Clinical domain:** TEVAR in HTAD

**Question:** Under what circumstances may TEVAR be considered in patients with Marfan syndrome, Loeys-Dietz syndrome, or other HTAD?

**Expected output elements:** Condition-specific guidance; emergency, bridge, prior surgical graft landing, and prohibitive-risk contexts; anatomy and durability considerations; reported outcomes and complications; multidisciplinary-review requirement; and clear distinction between guideline recommendations and observational practice.

**Critical references or source types:** Current guidelines, original HTAD TEVAR series, registries, systematic reviews, and expert consensus labeled appropriately.

**Common failure risks:** Recommending routine TEVAR; combining distinct syndromes; overstating case-series evidence; failing to distinguish native-aorta and surgical-graft landing zones.

**Validation status:** Not yet validated

## Question 26

**Clinical domain:** Endovascular acute type A dissection repair

**Question:** What evidence supports total endovascular treatment for acute type A aortic dissection?

**Expected output elements:** Candidate anatomy and exclusions; devices and techniques; case reports, series, and trials separated; technical success, mortality, stroke, rupture, conversion, and follow-up; regulatory status; comparison with surgical standard of care; and strong uncertainty language.

**Critical references or source types:** Original clinical reports, prospective feasibility studies, trial registries, regulatory documents, current guidelines, and bench or animal evidence labeled separately.

**Common failure risks:** Portraying experimental treatment as established; mixing ascending aneurysm and dissection; treating feasibility as comparative effectiveness; omitting surgical standard of care.

**Validation status:** Not yet validated

## Question 27

**Clinical domain:** Endovascular Bentall and ascending systems

**Question:** What are the current clinical trial stages and limitations of endovascular Bentall or ascending aortic endograft systems?

**Expected output elements:** Named systems and sponsors only when verified; preclinical, feasibility, pivotal, or registered-trial stage; enrollment and status as of a stated date; target anatomy; technical constraints; published human outcomes; regulatory status by region; and limitations including coronary, valve, access, and durability issues.

**Critical references or source types:** ClinicalTrials.gov, UMIN, jRCT, other official trial registries, FDA/PMDA documents, peer-reviewed reports, and manufacturer information labeled as such.

**Common failure risks:** Reporting outdated trial status; confusing prototypes; presenting investigational devices as approved; relying on promotional material; inventing specifications.

**Validation status:** Not yet validated

## Question 28

**Clinical domain:** Frozen elephant trunk (FET) in acute type A dissection

**Question:** What evidence supports frozen elephant trunk in acute type A dissection, and how does it compare with conventional arch repair?

**Expected output elements:** Patient and procedural selection; direct comparative and registry evidence; operative mortality, stroke, spinal cord ischemia, distal remodeling, reintervention, and survival; device and regional practice differences; guideline recommendations; and confounding and learning-curve limitations.

**Critical references or source types:** Comparative cohorts, propensity-adjusted studies, national or multicenter registries, meta-analyses, device trials, and current guidelines.

**Common failure risks:** Claiming randomized superiority; mixing elective aneurysm and acute dissection; ignoring neurologic risk; comparing different arch extents without adjustment.

**Validation status:** Not yet validated

## Question 29

**Clinical domain:** Academic output—chronic post-dissection aneurysm

**Question:** Create a one-slide evidence summary comparing false lumen embolization, F/BEVAR, and open conversion for chronic post-dissection aneurysmal degeneration.

**Expected output elements:** A concise slide title and takeaway; three-column comparison of indications, anatomy, invasiveness, early outcomes, durability, reintervention, major complications, evidence quality, and regulatory context; key citations; explicit absence of direct comparisons where applicable; and a bottom-line selection framework labeled as evidence or inference.

**Critical references or source types:** Original clinical series and comparative studies, registries, systematic reviews, guidelines, IFUs, and regulatory documents.

**Common failure risks:** Overcrowding the slide; inventing head-to-head data; mixing pathology; presenting AI-derived selection logic as guideline advice; omitting open-repair evidence.

**Validation status:** Not yet validated

## Question 30

**Clinical domain:** Guideline drafting—HTAD

**Question:** Create a guideline-style draft addressing endovascular treatment for heritable thoracic aortic disease, clearly separating recommendations, evidence, and knowledge gaps.

**Expected output elements:** Defined clinical question and population; recommendation statements with strength placeholders rather than fabricated grades; separate evidence summary by HTAD condition and anatomy; emergency and bridge exceptions; regional guideline comparison; regulatory context; PMID list; knowledge gaps; and explicit expert-commentary or AI-inference labels.

**Critical references or source types:** Current official US, European, and Japanese guidelines, original HTAD cohorts and registries, systematic reviews, and current regulatory documents.

**Common failure risks:** Fabricating recommendation grades; treating a draft as an official guideline; combining recommendations with inference; overstating small series; omitting condition-specific and regional differences.

**Validation status:** Not yet validated

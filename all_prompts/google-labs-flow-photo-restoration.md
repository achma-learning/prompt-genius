# Google Labs Flow — Photo Restoration & Upscaling Prompts

Long-form source for the four Flow restoration prompts shipped in
`Prompt generator.user.js` (`BUILTIN_PROMPTS`, category **Image Restoration**).
The palette ships the English versions — English is what the image models are
tuned on and it gives noticeably tighter results. The French versions here are
canonical translations, kept for reference and for pasting by hand.

## How to use them on labs.google

1. Open **Flow** (`labs.google/fx/tools/flow`) and start a new project.
2. Upload the photo as an **ingredient / reference image** — these prompts
   describe an edit of an existing image, not a generation from scratch.
3. Press `⌘⇧P` / `Ctrl+Shift+P` to open Prompt Genius, type `restore`, hit Enter.
4. Pick the prompt that matches your source material:
   - damaged B&W photo you want to keep B&W → **Prompt 1**
   - B&W photo you want colorized → **Prompt 2**
   - faded / yellowed color photo (70s–90s prints) → **Prompt 3**
   - source too destroyed or too low-res to restore honestly, and you want
     quality over fidelity → **Prompt 4**
5. Run it, then re-run the same prompt on the output if a second pass is needed.

## What was changed from the original prompts

The originals were a single paragraph of wishes. Three things were added, and
they are where most of the quality gain comes from:

- **An explicit identity-preservation block.** The number one failure mode of
  generative restoration is a face that comes back subtly younger, thinner, or
  simply someone else. Naming face geometry, age, and expression as untouchable
  is what stops it.
- **A hard negative list.** "Avoid plastic skin" buried mid-sentence gets
  ignored; a labelled `AVOID` block does not. Also covers the artifacts these
  models actually produce — HDR halos, sharpening ringing, invented jewelry,
  added watermarks or borders.
- **A structure the model can follow.** PRESERVE → REPAIR → ENHANCE → AVOID →
  OUTPUT, in priority order, with upscaling stated as an explicit step rather
  than assumed.

---

## Prompt 1 — Black & White → Black & White

Repairs a badly damaged photograph while keeping its original monochrome soul.

### English (shipped)

```
Professional archival restoration and upscale of the attached vintage black-and-white photograph. The result must stay monochrome.

PRESERVE (highest priority)
- The exact identity of every person: face geometry, bone structure, eye shape and spacing, nose, mouth, jawline, apparent age, expression, hairline. Do not beautify, slim, de-age, or re-imagine anyone.
- Original framing, aspect ratio, pose, composition, clothing, objects and background. Add nothing and remove no one.
- The authentic photographic character of the era: real film grain structure, period lens rendering, natural depth of field.

REPAIR
- Remove scratches, dust, specks, cracks, creases, folds, tape marks, water stains, mold spots and emulsion damage.
- Reconstruct torn, missing or bleached regions from surrounding context so the repair is invisible and anatomically correct.
- Recover detail lost in blown highlights and crushed shadows.

ENHANCE
- Increase true optical sharpness and micro-detail, prioritizing eyes, irises, eyelashes, skin pores, hair strands, fabric weave and any lettering.
- Rebuild the tonal range: deep neutral blacks, clean unclipped highlights, smooth mid-tone gradation, balanced contrast and exposure.
- Reduce heavy grain and scanner noise only where it reads as damage; keep fine natural grain so the image still reads as a photograph.
- Upscale to the maximum available resolution with clean, artifact-free edges.

AVOID
- Plastic or waxy skin, airbrushed smoothing, HDR halos, over-sharpening ringing, posterization or banding.
- Any added text, watermark, border, frame or signature.
- Any sepia, duotone, tint or partial colorization. The output stays neutral black and white.

OUTPUT: a single high-resolution, archival-quality monochrome photograph, historically faithful to the original.
```

### Français

```
Restauration d'archives professionnelle et agrandissement de la photographie ancienne en noir et blanc fournie. Le résultat doit rester monochrome.

PRÉSERVER (priorité absolue)
- L'identité exacte de chaque personne : géométrie du visage, structure osseuse, forme et écartement des yeux, nez, bouche, mâchoire, âge apparent, expression, implantation des cheveux. Ne pas embellir, affiner, rajeunir ni réinventer qui que ce soit.
- Le cadrage, le format, la pose, la composition, les vêtements, les objets et l'arrière-plan d'origine. Ne rien ajouter, ne supprimer personne.
- Le caractère photographique authentique de l'époque : véritable structure de grain argentique, rendu d'objectif d'époque, profondeur de champ naturelle.

RÉPARER
- Supprimer rayures, poussières, points, craquelures, plis, pliures, traces de ruban adhésif, auréoles d'humidité, taches de moisissure et dommages de l'émulsion.
- Reconstruire les zones déchirées, manquantes ou décolorées à partir du contexte environnant, de façon invisible et anatomiquement correcte.
- Récupérer les détails perdus dans les hautes lumières brûlées et les ombres bouchées.

AMÉLIORER
- Augmenter la netteté optique réelle et le micro-détail, en priorité sur les yeux, iris, cils, pores de la peau, mèches de cheveux, tissage des étoffes et toute inscription.
- Reconstruire la gamme tonale : noirs neutres profonds, hautes lumières propres non écrêtées, dégradé fluide des tons moyens, contraste et exposition équilibrés.
- Réduire le grain lourd et le bruit de numérisation uniquement là où il constitue un défaut ; conserver un grain fin naturel pour que l'image reste une photographie.
- Agrandir à la résolution maximale disponible, avec des contours propres et sans artefact.

ÉVITER
- Peau plastique ou cireuse, lissage aérographe, halos HDR, liserés de sur-accentuation, postérisation ou banding.
- Tout texte, filigrane, bordure, cadre ou signature ajouté.
- Tout sépia, bichromie, teinte ou colorisation partielle. Le résultat reste en noir et blanc neutre.

RÉSULTAT : une seule photographie monochrome haute résolution, de qualité archivistique, historiquement fidèle à l'original.
```

---

## Prompt 2 — Black & White → Color (AI colorization)

Repairs *and* colorizes, with a period-plausible palette.

### English (shipped)

```
Full restoration and natural colorization of the attached old black-and-white photograph. Restore first, colorize second.

STEP 1 — RESTORE
- Remove scratches, dust, cracks, folds, stains, mold and emulsion damage; reconstruct torn or missing areas from surrounding context.
- Recover detail in blown highlights and blocked shadows, and sharpen genuine detail: eyes, irises, hair strands, skin texture, fabric weave, lettering.
- Upscale to the maximum available resolution with clean, artifact-free edges.

STEP 2 — COLORIZE
- Accurate, believable skin tones with natural subsurface variation: warmer cheeks, ears, lips, knuckles; cooler shadow tones. No orange, gray or mask-like faces.
- Period-plausible colors for clothing, uniforms, dyes, paint, vehicles, signage and interiors, consistent with the apparent decade of the photograph.
- Natural environment color: sky, foliage, wood, stone, water rendered as they would look under the light actually present in the frame.
- One consistent light source and white balance across the whole image; shadows keep a cool tint, highlights a warm one, never fully saturated.
- Restrained, film-like grading with muted saturation, as if shot on color negative of that era.

PRESERVE
- Every face's exact identity, geometry, age and expression. Do not beautify, de-age or restyle anyone.
- Original framing, aspect ratio, pose, composition and background. Add nothing, remove no one.
- Natural photographic texture and fine grain.

AVOID
- Oversaturated, neon or candy colors; uniform flat color fills; color bleeding across edges.
- Modern-looking dyes, fabrics or materials that did not exist when the photo was taken.
- Plastic skin, airbrushed smoothing, HDR halos, over-sharpening ringing, added text, watermarks or borders.

OUTPUT: a single high-resolution color photograph that looks as if it had originally been shot in color, on film, in its own era.
```

### Français

```
Restauration complète et colorisation naturelle de la vieille photographie en noir et blanc fournie. D'abord restaurer, ensuite coloriser.

ÉTAPE 1 — RESTAURER
- Supprimer rayures, poussières, craquelures, plis, taches, moisissures et dommages de l'émulsion ; reconstruire les zones déchirées ou manquantes à partir du contexte environnant.
- Récupérer les détails dans les hautes lumières brûlées et les ombres bouchées, et accentuer le détail réel : yeux, iris, mèches de cheveux, texture de peau, tissage des étoffes, inscriptions.
- Agrandir à la résolution maximale disponible, avec des contours propres et sans artefact.

ÉTAPE 2 — COLORISER
- Tons de peau justes et crédibles, avec les variations naturelles : joues, oreilles, lèvres et articulations plus chaudes ; ombres plus froides. Pas de visages orangés, gris ou figés comme un masque.
- Couleurs plausibles pour l'époque : vêtements, uniformes, teintures, peinture, véhicules, enseignes et intérieurs, cohérents avec la décennie apparente de la photo.
- Couleurs d'environnement naturelles : ciel, feuillage, bois, pierre, eau rendus tels qu'ils apparaîtraient sous la lumière réellement présente dans l'image.
- Une seule source de lumière et une seule balance des blancs sur toute l'image ; ombres légèrement froides, hautes lumières légèrement chaudes, jamais saturées à fond.
- Étalonnage sobre et cinématographique, saturation modérée, comme un négatif couleur de l'époque.

PRÉSERVER
- L'identité exacte de chaque visage : géométrie, âge, expression. Ne pas embellir, rajeunir ni relooker.
- Le cadrage, le format, la pose, la composition et l'arrière-plan d'origine. Ne rien ajouter, ne supprimer personne.
- La texture photographique naturelle et le grain fin.

ÉVITER
- Couleurs sursaturées, fluo ou acidulées ; aplats de couleur uniformes ; débordement de couleur sur les contours.
- Teintures, tissus ou matériaux d'aspect moderne qui n'existaient pas à l'époque de la prise de vue.
- Peau plastique, lissage aérographe, halos HDR, liserés de sur-accentuation, texte, filigrane ou bordure ajoutés.

RÉSULTAT : une seule photographie couleur haute résolution, comme si elle avait été prise en couleur, sur pellicule, à son époque.
```

---

## Prompt 3 — Color → Color (reviving faded prints)

For 70s–90s photos that have yellowed, faded, or gone soft.

### English (shipped)

```
Advanced restoration of the attached faded, discolored or damaged color photograph. Bring it back to how it looked the day it was printed.

CORRECT THE COLOR
- Neutralize the age cast: remove yellowing, magenta or cyan shift, and any overall tint from faded dye layers.
- Rebuild an accurate white balance using neutral references in the frame (whites, grays, teeth, paper, concrete).
- Restore rich, natural, believable color and full saturation without pushing past what the scene really contained.
- Return skin tones to natural, healthy values with warm and cool variation; no orange, red or gray faces.

REPAIR AND RECOVER
- Remove scratches, dust, specks, creases, fingerprints, water stains, chromatic noise and JPEG or scanner artifacts.
- Reconstruct damaged, torn or missing areas realistically from surrounding context.
- Recover detail lost in blown highlights and blocked shadows, and rebuild contrast with deep blacks and clean whites.

ENHANCE
- Increase real optical sharpness and micro-detail: eyes, hair, skin texture, fabric weave, foliage, lettering. Correct mild softness or lens haze.
- Reduce grain and noise only where it reads as damage; keep the natural film texture.
- Upscale to the maximum available resolution with clean, artifact-free edges.

PRESERVE
- Every face's exact identity, geometry, age and expression. Do not beautify, slim, de-age or restyle anyone.
- Original framing, aspect ratio, composition, clothing and background. Add nothing, remove no one.

AVOID
- Over-processing: HDR halos, crunchy over-sharpening, plastic or waxy skin, airbrushed smoothing, posterization or banding.
- Heavy stylized grading, teal-and-orange looks, added text, watermarks or borders.

OUTPUT: a single clean, high-definition color photograph with revitalized color and natural photographic texture.
```

### Français

```
Restauration avancée de la photographie couleur fournie, décolorée, virée ou endommagée. La ramener à son aspect du jour de son tirage.

CORRIGER LA COULEUR
- Neutraliser la dérive due au vieillissement : jaunissement, virage magenta ou cyan, et toute dominante générale due à la décoloration des couches de colorants.
- Reconstruire une balance des blancs juste à partir des références neutres présentes dans l'image (blancs, gris, dents, papier, béton).
- Restaurer des couleurs riches, naturelles et crédibles, pleinement saturées sans dépasser ce que la scène contenait réellement.
- Ramener les tons de peau à des valeurs naturelles et saines, avec leurs variations chaudes et froides ; pas de visages orangés, rouges ou gris.

RÉPARER ET RÉCUPÉRER
- Supprimer rayures, poussières, points, plis, traces de doigts, auréoles d'humidité, bruit chromatique et artefacts JPEG ou de numérisation.
- Reconstruire de façon réaliste les zones abîmées, déchirées ou manquantes à partir du contexte environnant.
- Récupérer les détails perdus dans les hautes lumières brûlées et les ombres bouchées, et rétablir le contraste avec des noirs profonds et des blancs propres.

AMÉLIORER
- Augmenter la netteté optique réelle et le micro-détail : yeux, cheveux, texture de peau, tissage des étoffes, feuillage, inscriptions. Corriger le léger flou ou le voile d'objectif.
- Réduire grain et bruit uniquement là où ils constituent un défaut ; conserver la texture argentique naturelle.
- Agrandir à la résolution maximale disponible, avec des contours propres et sans artefact.

PRÉSERVER
- L'identité exacte de chaque visage : géométrie, âge, expression. Ne pas embellir, affiner, rajeunir ni relooker.
- Le cadrage, le format, la composition, les vêtements et l'arrière-plan d'origine. Ne rien ajouter, ne supprimer personne.

ÉVITER
- Le sur-traitement : halos HDR, accentuation excessive, peau plastique ou cireuse, lissage aérographe, postérisation ou banding.
- Étalonnage stylisé marqué, rendu teal-and-orange, texte, filigrane ou bordure ajoutés.

RÉSULTAT : une seule photographie couleur haute définition, propre, aux couleurs revitalisées et à la texture photographique naturelle.
```

---

## Prompt 4 — Max-Resolution Creative Upscale (no fidelity lock)

The opposite trade-off from prompts 1–3. Those three forbid invention; this one
**allows** it. Use it when the source is too far gone for a faithful restore —
a tiny thumbnail, a heavy JPEG, a blurred or half-destroyed print — and you
would rather have a beautiful, believable photograph than a technically honest
one.

**Be aware of what you are trading away.** The model will invent detail that was
never in the original: pores, hair strands, fabric weave, background objects,
and — most importantly — face detail. Faces can come back subtly *not the same
person*. Do not use this prompt for archival, legal, journalistic, historical or
identification work, or for anything you will present as an authentic record.
For those, use prompts 1–3, which lock identity and forbid invention.

### English (shipped)

```
Reconstruct and upscale the attached low-quality photograph into a maximum-resolution, high-end photographic image. Prioritize final image quality over strict fidelity to the degraded source — you are allowed to reinterpret and invent detail that the original no longer contains.

CREATIVE LICENSE (this prompt is deliberately not fidelity-locked)
- Treat the source as a reference for subject, pose, framing, lighting and mood, not as pixel truth.
- Freely synthesize plausible detail wherever the original is destroyed: skin texture and pores, individual hair strands, eyelashes, fabric weave and stitching, wood grain, foliage, architecture, background objects.
- Redraw soft, smeared, pixelated, compressed or half-missing regions as clean, sharp, physically coherent structure.
- Re-light and re-grade for a professional result: natural depth of field, believable specular highlights, clean subject separation, refined color and contrast.

RESOLUTION AND QUALITY
- Upscale to the maximum available resolution, keeping the original aspect ratio and framing.
- Remove all degradation: blur, JPEG blocking, banding, chroma noise, halos, upscaling artifacts, scratches, dust and stains.
- Deliver crisp, artifact-free edges and rich micro-contrast throughout.
- Final look: sharp, modern, high-end photography — as if shot on a full-frame camera with a fast prime lens, then finished professionally.

STAY COHERENT
- Keep the same subject, count of people, pose, expression, gaze direction, clothing type, era and scene. Do not change what the photograph is of.
- Keep human anatomy, hands, teeth, eyes and perspective physically correct.
- Keep one consistent light direction, color temperature and depth of field across the whole frame.

AVOID
- Plastic or waxy skin, airbrushed smoothing, uncanny doll faces, HDR halos, over-sharpening ringing, posterization.
- Cartoon, illustration, painterly, 3D-render or AI-glossy looks. The output must read as a real photograph.
- Added text, watermarks, borders, frames, signatures or extra people.

OUTPUT: a single maximum-resolution photorealistic image of the same scene, rebuilt to modern photographic quality.
```

### Français

```
Reconstruire et agrandir la photographie de mauvaise qualité fournie en une image photographique haut de gamme, à la résolution maximale. Privilégier la qualité finale de l'image plutôt que la fidélité stricte à la source dégradée : tu es autorisé à réinterpréter et à inventer les détails que l'original ne contient plus.

LIBERTÉ CRÉATIVE (ce prompt n'impose volontairement pas la fidélité)
- Traiter la source comme une référence de sujet, de pose, de cadrage, de lumière et d'ambiance, et non comme une vérité pixel par pixel.
- Synthétiser librement des détails plausibles là où l'original est détruit : texture et pores de la peau, mèches de cheveux, cils, tissage et coutures des étoffes, veinage du bois, feuillage, architecture, objets d'arrière-plan.
- Redessiner les zones floues, baveuses, pixelisées, compressées ou à moitié manquantes en une structure nette et physiquement cohérente.
- Ré-éclairer et ré-étalonner pour un rendu professionnel : profondeur de champ naturelle, reflets spéculaires crédibles, bonne séparation du sujet, couleur et contraste soignés.

RÉSOLUTION ET QUALITÉ
- Agrandir à la résolution maximale disponible, en conservant le format et le cadrage d'origine.
- Supprimer toute dégradation : flou, blocs JPEG, banding, bruit chromatique, halos, artefacts d'agrandissement, rayures, poussières et taches.
- Livrer des contours nets et sans artefact, avec un micro-contraste riche sur toute l'image.
- Rendu final : photographie moderne et haut de gamme, comme prise au plein format avec un objectif fixe lumineux, puis finalisée professionnellement.

RESTER COHÉRENT
- Conserver le même sujet, le même nombre de personnes, la pose, l'expression, la direction du regard, le type de vêtement, l'époque et la scène. Ne pas changer ce que la photo représente.
- Conserver une anatomie humaine correcte : mains, dents, yeux, perspective.
- Conserver une direction de lumière, une température de couleur et une profondeur de champ cohérentes sur toute l'image.

ÉVITER
- Peau plastique ou cireuse, lissage aérographe, visages de poupée dérangeants, halos HDR, liserés de sur-accentuation, postérisation.
- Rendu cartoon, illustration, pictural, 3D ou « IA brillante ». Le résultat doit se lire comme une vraie photographie.
- Texte, filigrane, bordure, cadre, signature ou personne supplémentaire ajoutés.

RÉSULTAT : une seule image photoréaliste à la résolution maximale, représentant la même scène, reconstruite à une qualité photographique moderne.
```

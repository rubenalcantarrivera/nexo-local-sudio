# Campaign 03 - Mexico/LATAM 250

## Summary

- Raw candidates researched from public OpenStreetMap/Overpass data: 2727
- Duplicate exclusions: 1343
- Excluded candidates: 1142
- Qualified prospects: 250
- Pending WhatsApp verification: 250
- Ready to send now: 0

## Method Used

Candidates were collected from public OpenStreetMap records through Overpass API. Rows were deduplicated against existing outreach CSVs, filtered to public phones, normalized by country, and included only when the public record had no official website or only a social/profile link. Ratings and reviews are not available from this source.

### Country Breakdown

| Valor | Total |
|---|---:|
| Mexico | 130 |
| Colombia | 70 |
| Peru | 45 |
| Chile | 5 |

### Niche Breakdown

| Valor | Total |
|---|---:|
| Restaurante boutique | 112 |
| Clínica estética | 66 |
| Dental | 54 |
| Óptica/Oftalmología premium | 7 |
| Veterinaria | 7 |
| Academia privada | 4 |

### Website Status Breakdown

| Valor | Total |
|---|---:|
| No website found | 245 |
| Only Instagram/Facebook | 5 |

## Top 30 Prospects

| Priority | Business | Niche | City/Zone | Website status | Phone | Score |
|---|---|---|---|---|---|---:|
| A | CADEVI | Clínica estética | Ciudad de México/Lomas/Bosques/Polanco/Nápole | No website found | 525540692133 | 15 |
| A | Maternidad Santisima Trinidad | Clínica estética | Ciudad de México/Lomas/Bosques/Polanco/Nápole | No website found | 525553018930 | 15 |
| A | Clinica San Martin De Porres | Clínica estética | Ciudad de México/Lomas/Bosques/Polanco/Nápole | No website found | 525532697565 | 15 |
| A | Consultorio dental estética | Dental | Ciudad de México/Lomas/Bosques/Polanco/Nápole | No website found | 525526416589 | 15 |
| A | Consultorio Dental Armenta | Dental | Ciudad de México/Lomas/Bosques/Polanco/Nápole | No website found | 525526578032 | 15 |
| A | Campos | Dental | Ciudad de México/Lomas/Bosques/Polanco/Nápole | No website found | 525555307843 | 15 |
| A | Consultorio Medico El Divino Redentor | Clínica estética | Ciudad de México/Lomas/Bosques/Polanco/Nápole | No website found | 525553003102 | 15 |
| A | Clinica Milenium | Clínica estética | Ciudad de México/Lomas/Bosques/Polanco/Nápole | No website found | 525553042495 | 15 |
| A | Consultorio dental Nami | Dental | Ciudad de México/Lomas/Bosques/Polanco/Nápole | No website found | 525535521501 | 15 |
| A | Clinica de unidad médica integral | Clínica estética | Ciudad de México/Lomas/Bosques/Polanco/Nápole | No website found | 525553041280 | 15 |
| A | Consultorio Medico Homeopatico | Clínica estética | Ciudad de México/Lomas/Bosques/Polanco/Nápole | No website found | 525532026600 | 15 |
| A | Botiquín Médico Parroquia De Nuestra Señor | Clínica estética | Ciudad de México/Lomas/Bosques/Polanco/Nápole | No website found | 525552950199 | 15 |
| A | Consultorio Dental Salud Dental | Dental | Ciudad de México/Lomas/Bosques/Polanco/Nápole | No website found | 525571137640 | 15 |
| A | Consultorio Dental La Loma | Dental | Ciudad de México/Lomas/Bosques/Polanco/Nápole | No website found | 525523005216 | 15 |
| A | Consultorio Medico Country | Clínica estética | Ciudad de México/Lomas/Bosques/Polanco/Nápole | No website found | 525554547182 | 15 |
| A | Consultorio Dental Juarez | Dental | Ciudad de México/Lomas/Bosques/Polanco/Nápole | No website found | 525553120846 | 15 |
| A | Policlinico Solidario San Juan de Miraflor | Clínica estética | Lima/Miraflores/San Isidro/Surco/ | No website found | 5114665676 | 15 |
| A | EsSalud Policlínico San Luis | Clínica estética | Lima/Miraflores/San Isidro/Surco/ | No website found | 5113262599 | 15 |
| A | Dental Zegarra | Dental | Lima/Miraflores/San Isidro/Surco/ | No website found | 5114366986 | 15 |
| A | Kabelo | Clínica estética | Lima/Miraflores/San Isidro/Surco/ | No website found | 5114361807 | 15 |
| A | Ellas Spa | Clínica estética | Lima/Miraflores/San Isidro/Surco/ | No website found | 5113588119 | 15 |
| A | Clinica Dental ODONTOBELL'E | Dental | Lima/Miraflores/San Isidro/Surco/ | No website found | 5114372982 | 15 |
| A | Centro de Salud San Isidro | Clínica estética | Lima/Miraflores/San Isidro/Surco/ | No website found | 5112643125 | 15 |
| A | Facé Salón & Spá | Clínica estética | Lima/Miraflores/San Isidro/Surco/ | No website found | 51988010710 | 15 |
| A | Centro Odontológico Dly Dent | Dental | Lima/Miraflores/San Isidro/Surco/ | No website found | 5112400553 | 15 |
| A | Óptica Aris Visión | Óptica/Oftalmología premium | Ciudad de México/Lomas/Bosques/Polanco/Nápole | No website found | 525553044557 | 14 |
| A | Centro Odontológico Medici | Dental | Medellín/El Poblado/Provenza/Laureles | No website found | 573026397083 | 14 |
| A | Illumident | Dental | Medellín/El Poblado/Provenza/Laureles | No website found | 573182900517 | 14 |
| A | U are Love | Clínica estética | Medellín/El Poblado/Provenza/Laureles | No website found | 573022485767 | 14 |
| A | Aluna Centro de Belleza | Clínica estética | Medellín/El Poblado/Provenza/Laureles | No website found | 575745968437 | 14 |

## Verification Instructions

```bash
python3 outreach/scripts/campaign03_verify_whatsapp.py --campaign outreach/campaigns/campaign_03_mexico_latam_250 --limit 250
```

Enter marks a number as `exists_on_whatsapp`. No message is sent during verification.

## Generate Queue After Verification

```bash
python3 outreach/scripts/campaign03_generate_queue.py --campaign outreach/campaigns/campaign_03_mexico_latam_250
```

## Send Verified Messages

```bash
python3 outreach/scripts/campaign03_send_whatsapp.py --campaign outreach/campaigns/campaign_03_mexico_latam_250 --limit 250
```

The script opens one prefilled WhatsApp chat at a time. The user manually presses Send and then Enter in terminal.

## Message Used

```text
Hola, buen día.

Somos Nexo Local Studio. Hacemos páginas web profesionales para negocios que quieren mostrar servicios, ubicación y contacto de forma clara desde el celular.

También podemos integrar un asistente con IA que responde preguntas frecuentes y guía al cliente hacia WhatsApp.

Pueden ver nuestra página aquí:
https://nexo-local-studio-public.vercel.app

Tenemos precios de lanzamiento desde $2,500 MXN. Si les interesa, podemos enviarles una propuesta breve.

Si prefieren no recibir más mensajes, respondan “baja”.
```

## Compliance Notes

- No automatic sending.
- No unofficial WhatsApp APIs.
- No business names inside first message.
- No demo links in first message.
- Includes opt-out line.
- Agency number is blocked as a recipient.
- Numbers must be manually verified before send queue becomes ready.

## Limitations

- OpenStreetMap does not provide ratings/reviews, so those fields are blank.
- `No website found` means no official website was present in the OSM public record; a final manual spot-check is recommended before high-volume sending.
- WhatsApp existence is not assumed. Run the verification script first.

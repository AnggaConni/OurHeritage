# 🌦️ Early Warning System for Cultural Heritage & Museum Conservation

A real‑time environmental monitoring application based on **live and historical data** from multiple public APIs to support artifact, heritage site, and museum conservation.  
Features an early warning system and anticipatory action recommendations based on the **DESTANA** methodology.

---

## ✅ Live API Data Sources (Real, Not Dummy)

Weather, air quality, earthquake, flood, solar radiation, and hotspot data are fetched directly from APIs when a location is selected.  
**No dummy or made‑up numbers** – every figure comes directly from the provider.

| Data | API Provider | Status |
|------|--------------|--------|
| Temperature, Humidity (RH), Rainfall, Soil Moisture, Soil Temperature, 7‑day Forecast | **Open-Meteo Forecast** | ✅ 100% real, no API key required |
| PM2.5, PM10, Dust, UV, O₃, NO₂, SO₂ | **Open-Meteo Air Quality** | ✅ Real, no API key required |
| Earthquakes within 100 km (last 7 days) | **USGS Earthquake** | ✅ Real, no API key required |
| Flood / River Discharge (GloFAS/Copernicus) | **Open-Meteo Flood** | ✅ Real, no API key required |
| Solar Radiation | **NASA POWER** | ✅ Real, no API key required |
| Fire Hotspots | **NASA FIRMS** | ✅ Real, **API key required** |

**"Sample Sites"** (Borobudur, Prambanan, etc.) contain only coordinates and names.  
Once selected, all weather, earthquake, and flood data for that location are pulled live from the APIs – no invented numbers.

---

## ⚠️ Calculated / Estimated Indicators (Not Direct APIs, but Formulas)

Some indicators lack a direct public API. They are computed from the real data listed above and are **marked with ⚠ in the UI** for transparency.

| Indicator | Derived From / Method |
|-----------|------------------------|
| **Risk Score (Artifact Risk)** | DESTANA formula: `(Hazard × Vulnerability) ÷ Capacity` – computed from live API data |
| **Mold Index** | Calculated from actual RH + temperature (mold threshold model) |
| **Moss / Lichen Growth** | Calculated from actual RH + temperature + rainfall |
| **Crack Risk / Erosion** | Calculated from daily temperature range + actual rainfall intensity |
| **Light (lux) ⚠** | Estimated from UV + cloud cover – **not** a real lux sensor |
| **VOC ⚠** | Proxy estimated from outdoor O₃/NO₂ concentrations – **not** an indoor VOC sensor |
| **Insect / Pest Risk** | Calculated from actual temperature + RH |

All calculations rely on *outdoor* data from APIs, so they must be interpreted as outdoor environmental risks. For indoor accuracy, physical sensors are required (see limitations).

---

## 🎯 Real Purpose of the Application

This is an **Early Warning System (EWS)** designed specifically for cultural heritage and museum conservation.

1. **Automated environmental monitoring**  
   Displays real‑time weather, pollution, earthquake, and flood conditions at each site without installing physical equipment on‑site.

2. **Artifact damage risk prediction**  
   Provides risk scores based on material type (wood, leather, metal, etc.). Example: if RH reaches 85%, mold risk for wooden/leather artifacts becomes high.

3. **Anticipatory Action (automated SOPs)**  
   Suggests immediate actions, such as:
   - Turn on dehumidifier
   - Close gallery / vitrine
   - Relocate artifacts to controlled storage
   - Activate additional ventilation

4. **Documentation & dashboard for curators/conservators**  
   All data and recommendations are logged, supporting evidence‑based decision making.

---

## ⚠️ Honest Limitations (Important to Understand)

This application **CANNOT** replace physical sensors inside buildings. Here is what it cannot do:

- ❌ **It does not measure conditions *inside* museum rooms.**  
  Weather APIs provide *outdoor* data with a grid resolution of approximately 1–11 km.  
  The relative humidity inside an air‑conditioned vitrine can be vastly different.  
  **For accurate indoor microclimate monitoring, physical IoT sensors (RH, temperature, lux loggers) are mandatory.**

- ❌ **Indoor light (lux) and VOC are only rough estimates.**  
  Displayed values are proxies derived from *outdoor* data – not direct indoor measurements.

- ❌ **Volcanic ash has no dedicated API.**  
  Currently uses FIRMS hotspots as a heat proxy – does not directly measure ash dispersal.

### Summary
This application is **valid as an outdoor environment‑based early warning system and for mitigation planning (DESTANA)**.  
For microclimate monitoring inside collection spaces, it should ideally be **combined with physical sensors** – where this application can serve as the unifying dashboard and decision‑support tool.

---

## 📦 Technology & Installation

*Add installation instructions, dependencies, and how to run the project here as needed.*  
Example: `git clone ...`, `npm install`, `node server.js`, etc.

---

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL v3)**.  
You are free to use, modify, and distribute it, but any modified versions must also be distributed under the same license and source code must be made available to network users.

See [LICENSE](./LICENSE) for full text.

---

**Built to support cultural heritage conservation intelligently, transparently, and based on real data.**  
For questions or contributions, please open an *issue* or *pull request*.

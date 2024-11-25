import Leaflet from "../ui/Leaflet";

export default function Panel({ data, id, rings }) {
  const { attributes } = data;
  return id != "Map" ? (
    <div className="tab-pane active " id={id} role="tabpanel">
      <div>
        <PanelText attributes={attributes} id={id} />
      </div>
    </div>
  ) : (
    <div className="county_map">
      <Leaflet
        key={attributes.ED_ENGLISH}
        coordinates={[rings[0][0][1], rings[0][0][0]]}
        capital={attributes.ED_ENGLISH}
      />
    </div>
  );
}
function PanelText({ attributes, id }) {
  const { CONTAE, COUNTY, ED_ENGLISH, PROVINCE, T1_1AGETT } = attributes;
  const { T1_1AGETF, T1_1AGETM, T1_2SGLF, T1_2SGLM } = attributes;
  return (
    <>
      <h4 className="card-title">{ED_ENGLISH}</h4>
      <div className="infoBox">
        <div>
          <p>
            <strong>{id === "Des" ? "County: " : "Total Male: "}</strong>
            {id === "Des" ? COUNTY : T1_1AGETF.toLocaleString("en-US")}
          </p>
          <p>
            <strong>{id === "Des" ? "Contae: " : "Single Male: "}</strong>
            {id === "Des" ? CONTAE : T1_2SGLM.toLocaleString("en-US")}
          </p>
        </div>
        <div>
          <p>
            <strong>{id === "Des" ? "Province: " : "Single Females: "}</strong>
            {id === "Des" ? PROVINCE : T1_2SGLF.toLocaleString("en-US")}
          </p>
          <p>
            <strong>{id === "Des" ? "Population: " : "Total Female: "}</strong>
            {id === "Des" ? T1_1AGETT : T1_1AGETM.toLocaleString("en-US")}
          </p>
        </div>
      </div>
    </>
  );
}

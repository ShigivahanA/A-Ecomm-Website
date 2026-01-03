// src/pages/Delivery.jsx
import React, { useEffect, useRef, useState } from "react";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";

export default function Delivery() {
  const topRef = useRef(null);
  const resultRef = useRef(null);

  const [pincode, setPincode] = useState("");
  const [checking, setChecking] = useState(false);
  const [deliverable, setDeliverable] = useState(null);
  const [message, setMessage] = useState("");

  const DELIVERY_PINCODES = new Set([
  "600001","600002","600003","600004","600005","600006","600007","600008","600009","600010",
  "600011","600012","600013","600014","600015","600016","600017","600018","600019","600020",
  "600021","600022","600023","600024","600025","600026","600027","600028","600029","600030",
  "600031","600032","600033","600034","600035","600036","600037","600038","600039","600040",
  "600041","600042","600043","600044","600045","600046","600047","600048","600049","600050",
  "600051","600052","600053","600054","600055","600056","600057","600058","600059","600060",
  "600061","600062","600063","600064","600065","600066","600067","600068","600069","600070",
  "600071","600072","600073","600074","600075","600076","600077","600078","600079","600080",
  "600081","600082","600083","600084","600085","600086","600087","600088","600089","600090",
  "600091","600092","600093","600094","600095","600096","600097","600098","600099",

  // Chengalpattu
  "603001","603002","603003","603004","603005","603006","603007","603008","603009","603010",
  "603011","603012","603013","603014","603015","603016","603017","603018","603019","603020",
  "603021","603022","603023","603024","603025","603026","603027","603028","603029","603030",

  // Kanchipuram
  "631501","631502","631503","631504","631505","631551","631552","631602","631603","631604",
  "631605","631606","631607","631608","631609","631610","631611","631612",

  // Tiruvallur
  "602001","602002","602003","602004","602005","602006","602021","602101","602102","602103",
  "602104","602105","602106","602107","602108","602109","602110","602111","602112","602113",
  "602114","602115","602116","602117",

  // Vellore
  "632001","632002","632003","632004","632005","632006","632007","632008","632009","632010",
  "632011","632012","632013","632014","632015","632016","632017","632018","632019","632020",
  "632021","632022","632023","632024","632025",

  // Ranipet / Tirupattur
  "635001","635002","635003","635004","635005","635006","635007","635008","635009","635010",
  "635101","635102","635103","635104","635105","635106","635107","635108","635109","635110",

  // Krishnagiri
  "635111","635112","635113","635114","635115","635116","635117","635118","635119","635120",
  "635121","635122","635123","635124","635125","635126","635127","635128","635129",

  // Dharmapuri
  "636701","636702","636703","636704","636705","636706","636707","636708","636709","636710",
  "636901","636902","636903","636904","636905","636906","636907","636908","636909",

  // Salem
  "636001","636002","636003","636004","636005","636006","636007","636008","636009","636010",
  "636011","636012","636013","636014","636015","636016","636017","636018","636019","636020",

  // Namakkal
  "637001","637002","637003","637004","637005","637006","637007","637008","637009","637010",
  "637201","637202","637203","637204","637205","637206","637207","637208","637209","637210",

  // Erode
  "638001","638002","638003","638004","638005","638006","638007","638008","638009","638010",
  "638011","638012","638013","638014","638015","638016",

  // Tiruppur
  "641001","641002","641003","641004","641005","641006","641007","641008","641009","641010",
  "641011","641012","641013","641014","641015","641016","641017","641018","641019","641020",

  // Coimbatore rural
  "641021","641022","641023","641024","641025","641026","641027","641028","641029","641030",
  "641031","641032","641033","641034","641035","641036","641037","641038","641039","641040",

  // Nilgiris
  "643001","643002","643003","643004","643005","643006","643007","643101","643102",
  "643103","643104","643105","643201","643202","643203","643204","643205","643206",

  // Tiruchirappalli
  "620001","620002","620003","620004","620005","620006","620007","620008","620009",
  "620010","620011","620012","620013","620014","620015","620016","620017","620018",

  // Karur
  "639001","639002","639003","639004","639005","639006","639007","639008","639009","639010",

  // Perambalur
  "621212","621213","621214","621215","621216","621217","621218","621219","621220",

  // Ariyalur
  "621701","621702","621703","621704","621705","621706","621707","621708","621709",

  // Thanjavur
  "613001","613002","613003","613004","613005","613006","613007","613008","613009","613010",

  // Tiruvarur
  "610001","610002","610003","610004","610101","610102","610103","610105",

  // Nagapattinam / Mayiladuthurai
  "609001","609002","609003","609004","609005","609006","609007","609008","609009",
  "609101","609102","609103","609104",

  // Pudukkottai
  "622001","622002","622003","622004","622005","622101","622102","622103","622104",

  // Sivagangai
  "630001","630002","630003","630004","630005","630006","630007","630008","630009",

  // Madurai
  "625001","625002","625003","625004","625005","625006","625007","625008","625009","625010",
  "625011","625012","625013","625014","625015","625016","625017","625018",

  // Theni
  "625531","625532","625533","625534","625535","625536","625537","625538","625539",

  // Dindigul
  "624001","624002","624003","624004","624005","624006","624007","624008","624009",

  // Ramanathapuram
  "623501","623502","623503","623504","623505","623506","623507","623508",

  // Virudhunagar
  "626001","626002","626003","626004","626005","626006","626007","626008",

  // Sivakasi / Rajapalayam region
  "626124","626125","626126","626127","626128","626129","626130","626131",

  // Thoothukudi
  "628001","628002","628003","628004","628005","628006","628007","628008","628009",

  // Tirunelveli
  "627001","627002","627003","627004","627005","627006","627007","627008","627009","627010",

  // Kanyakumari
  "629001","629002","629003","629004","629101","629102","629103","629104","629105",
  "629106","629107","629108","629109","629110","629151"
  ]);


  const checkPincode = async (e) => {
    e?.preventDefault();
    setDeliverable(null);
    setMessage("");
    const pin = (pincode || "").trim();
    if (!/^\d{6}$/.test(pin)) {
      setMessage("Enter a valid 6-digit pincode.");
      setDeliverable(false);
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setChecking(true);
    try {
      // simulate latency; replace with axios/your endpoint if available
      await new Promise((r) => setTimeout(r, 350));
      const isDeliverable = DELIVERY_PINCODES.has(pin);

      setDeliverable(isDeliverable);
      setMessage(
        isDeliverable
          ? `Great — we deliver to ${pin}. Estimated delivery: 3–7 business days.`
          : `Sorry — we don't currently deliver to ${pin}.`
      );

      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    } catch (err) {
      console.error(err);
      setDeliverable(false);
      setMessage("Unable to check pincode right now. Please try again later.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-[60vh] py-16 px-4 max-w-5xl mx-auto text-gray-700">
      <div ref={topRef} id="delivery-top" />

      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"DELIVERY"} text2={"INFO"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <div className="flex-1 text-gray-600">
          <p>
            We offer secure and reliable delivery across many regions in India.
            Orders are processed quickly and handed to trusted courier partners for timely delivery.
          </p>

          <h4 className="mt-6 font-semibold">Processing & delivery times</h4>
          <ul className="list-disc ml-6 mt-3 leading-7">
            <li>Processing time: 1–3 business days</li>
            <li>Standard delivery: 3–7 business days (regional variance)</li>
            <li>Express shipping: available at checkout for select pin codes</li>
            <li>Tracking details are shared after shipment via email/SMS</li>
          </ul>

          <h4 className="mt-6 font-semibold">Damages & returns</h4>
          <p className="mt-2">
            Please inspect your order on delivery. For damaged or incorrect items, contact us within 48 hours and we'll guide you through returns and replacement.
          </p>
        </div>

        <div className="md:w-2/4">
          <div className="border rounded-xl p-6 bg-[#f8f8f8]">
            <h4 className="font-semibold mb-3">Check delivery to your area</h4>

            <form onSubmit={checkPincode} className="flex flex-col gap-3">
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit pincode (e.g. 110001)"
                inputMode="numeric"
                className="border px-3 py-2 rounded w-full"
                aria-label="Pincode"
                autoFocus
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={checking}
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  {checking ? "Checking…" : "Check"}
                </button>

                <button
                  type="button"
                  onClick={() => { setPincode(""); setDeliverable(null); setMessage(""); }}
                  className="px-3 py-2 border rounded"
                >
                  Clear
                </button>
              </div>
            </form>

            <div ref={resultRef} className="mt-4">
              {deliverable === true && (
                <div className="p-3 rounded bg-green-50 border border-green-100 text-green-800">
                  {message}
                </div>
              )}
              {deliverable === false && message && (
                <div className="p-3 rounded bg-red-50 border border-red-100 text-red-800">
                  {message}
                  <div className="text-sm mt-2 text-gray-600">
                    If you'd like us to consider your area, please{" "}
                    <a href="/contact" className="underline">contact us</a> with the full address.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className=" text-xl py-4">
        <Title text1={"WHERE"} text2={"WE DELIVER"} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border bg-[#e5e5e5] px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Statewide coverage:</b>
          <p className=" text-gray-600">We currently deliver to most metro and tier-2 cities. Rural deliveries are supported through specific courier partners.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Tracking & notifications:</b>
          <p className=" text-gray-600">You'll receive email/SMS updates with tracking links once your order ships.</p>
        </div>
        <div className="border bg-[#e5e5e5] px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Bulk & corporate orders:</b>
          <p className=" text-gray-600">For bulk shipping or corporate requests, email us at <span className="font-medium">contactmayile@gmail.com</span>.</p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
}

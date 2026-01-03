import React from "react";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";

export default function SizeGuide() {
  return (
    <div className="min-h-[60vh] py-16 px-4 max-w-5xl mx-auto text-gray-700">
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"SIZE"} text2={"GUIDE"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <div className="flex-1 text-gray-600">
          <p>
            Use this guide to find your best fit. Measurements below are garment-ready approximations — for the
            most accurate fit, measure yourself wearing light clothing and compare to the chart.
          </p>

          <h4 className="mt-6 font-semibold">How to measure</h4>
          <ul className="list-disc ml-6 mt-3 leading-7 text-sm">
            <li><b>Bust:</b> Measure around the fullest part of your bust, keeping the tape level and comfortable.</li>
            <li><b>Waist:</b> Measure around the narrowest part of your waist (natural waistline).</li>
            <li><b>Hips:</b> Measure around the fullest part of your hips — typically 20–23 cm below the waist.</li>
            <li><b>Shoulder width:</b> From shoulder seam to shoulder seam across the back (for fitted tops).</li>
          </ul>

          <h4 className="mt-6 font-semibold">Tips for a great fit</h4>
          <ul className="list-disc ml-6 mt-3 leading-7 text-sm">
            <li>When between sizes, choose the larger size for a relaxed fit or the smaller for a slimmer silhouette.</li>
            <li>If you prefer to layer or wear heavier fabrics underneath, allow 1–2 cm extra ease.</li>
            <li>For dresses with a fitted waist, pay special attention to your waist measurement for comfort while seated.</li>
          </ul>
        </div>

        <div className="md:w-2/4">
          <div className="border rounded-xl p-6 bg-[#e5e5e5]">
            <h4 className="font-semibold mb-3">Quick conversion</h4>
            <p className="text-sm text-gray-600 mb-3">
              Not sure whether to choose S or M? Below is a quick Bust/Waist/Hip conversion (cm / inches).
            </p>

            <div className="overflow-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left text-xs text-gray-600">
                    <th className="pb-2">Size</th>
                    <th className="pb-2">Bust (cm / in)</th>
                    <th className="pb-2">Waist (cm / in)</th>
                    <th className="pb-2">Hips (cm / in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="py-2">XS</td>
                    <td className="py-2">78 / 30.7</td>
                    <td className="py-2">62 / 24.4</td>
                    <td className="py-2">86 / 33.9</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2">S</td>
                    <td className="py-2">84 / 33.1</td>
                    <td className="py-2">68 / 26.8</td>
                    <td className="py-2">92 / 36.2</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2">M</td>
                    <td className="py-2">90 / 35.4</td>
                    <td className="py-2">74 / 29.1</td>
                    <td className="py-2">98 / 38.6</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2">L</td>
                    <td className="py-2">96 / 37.8</td>
                    <td className="py-2">80 / 31.5</td>
                    <td className="py-2">104 / 40.9</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2">XL</td>
                    <td className="py-2">102 / 40.2</td>
                    <td className="py-2">86 / 33.9</td>
                    <td className="py-2">110 / 43.3</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p><b>Note:</b> Different styles have different ease — relaxed silhouettes may measure larger than the chart suggests.</p>
            </div>
          </div>
        </div>
      </div>

      <div className=" text-xl py-4">
        <Title text1={"FIT"} text2={"GUIDE"} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border bg-[#e5e5e5] px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Fitted</b>
          <p className=" text-gray-600">Designed to follow the body. Choose your true size or size up if you prefer more room.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Regular</b>
          <p className=" text-gray-600">Balanced proportions — choose your usual size for most everyday styles.</p>
        </div>
        <div className="border bg-[#e5e5e5] px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Relaxed</b>
          <p className=" text-gray-600">Generous cut for comfort — if between sizes, take your smaller measurement for a neater look.</p>
        </div>
      </div>

      <div className="mb-16">
        <h4 className="font-semibold mb-3">Frequently asked</h4>

        <div className="text-sm text-gray-600 space-y-3">
          <div>
            <b>Q:</b> How do I measure hips correctly?<br />
            <b>A:</b> Measure around the fullest part of your hips and buttocks, keeping the tape parallel to the floor.
          </div>

          <div>
            <b>Q:</b> Should I measure bust wearing a bra?<br />
            <b>A:</b> Wear a non-padded bra for the most accurate bust measurement.
          </div>

          <div>
            <b>Q:</b> What if my top and bottom sizes differ?<br />
            <b>A:</b> Order each item according to its recommended measurements — use the chart for both tops and bottoms.
          </div>
        </div>
      </div>
    </div>
  );
}

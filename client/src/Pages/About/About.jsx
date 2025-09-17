const About = () => {
  const patrons = [
    {
      title: "Chief Patron",
      name: "Dr. Mohammad Khalequzzaman",
      designation: "Director General, BRRI",
      image: "/brri-dg-2.jpeg", // Replace with actual path
    },
    {
      title: "Patron",
      name: "Dr. Md Rafiqul Islam",
      designation: "Director (Research), BRRI",
      image: "/brri-da.jpg", // Replace with actual path
    },
  ];
  const reviewers = [
    {
      name: "Dr. ABM Zahid Hossain",
      designationLine1: "SSO, IWM Division",
      designationLine2: "& Labrotory Coordinator, Agromet Lab, BRRI",
      image: "/zahid.jpg", // Replace with actual path
    },
  ];
  return (
    <div className="min-h-screen max-w-full font-book-antiqua  bg-green-50 flex flex-col items-center justify-center md:p-6">
      <div className=" bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-xl md:text-3xl font-bold text-green-700 text-center mb-6">
          Development of a Call Centre for Strengthening Climate Risk Management
          in Rice-Based Farming Systems
        </h1>

        <p className="text-gray-700 md:text-lg leading-relaxed mb-6 text-justify">
          <em>
            "The BRRI Call Center transforms agricultural advisory into a fast,
            farmer-driven service, delivering expert guidance exactly when and
            where it’s needed. By connecting farmers directly with scientists,
            it empowers informed decisions, boosts rice yields, and builds
            resilience against climate challenges."
          </em>
        </p>
        <p className="text-gray-700 md:text-lg leading-relaxed mb-6 text-justify">
          In today’s fast-evolving digital era, technology is reshaping
          agriculture through precision farming, satellite-based forecasts,
          AI-driven pest diagnostics, and mobile advisory platforms. For
          countries like Bangladesh, where agriculture remains the backbone of
          the economy and rice is central to rural livelihoods, timely access to
          scientific knowledge is critical for improving productivity, building
          climate resilience, and ensuring food security. Over 40% of the
          population depends on agriculture, yet traditional advisory systems,
          public extension services, informal networks, and local input dealers,
          often suffer from delays, inefficiencies, and inconsistent quality.
        </p>
        <p className="text-gray-700 md:text-lg leading-relaxed mb-6 text-justify">
          Recently, digital engagement in rural Bangladesh has grown
          significantly. More than 60% of households now own mobile phones, and
          young farmers increasingly use apps, social media, and agricultural
          websites for advice. Global models such as AgriCentral, Kisan Network,
          and AgriCop demonstrate how mobile-based services can connect farmers
          with experts and weather advisories. However, many Bangladeshi
          farmers, especially those with low digital literacy, still prefer
          speaking directly with experts. Agricultural call centers combine
          simplicity with depth, offering real-time, personalized, and locally
          relevant guidance.
        </p>
        <p className="text-gray-700 md:text-lg leading-relaxed mb-6 text-justify">
          Despite major advances in rice research by the Bangladesh Rice
          Research Institute (BRRI)—including stress-tolerant varieties, modern
          agronomic practices, and integrated pest management—knowledge
          dissemination remains slow. The conventional chain, from BRRI
          scientists to Sub-Assistant Agriculture Officers (SAAOs), then to
          extension agents and finally to farmers, is fragmented and often too
          late to prevent crop loss. Overburdened extension staff and remote
          farming communities exacerbate this challenge. In situations where
          pest outbreaks or erratic weather can devastate crops within days,
          such delays are critical.
        </p>
        <p className="text-gray-700 md:text-lg leading-relaxed mb-6 text-justify">
          To address these gaps, the BRRI Agromet Lab launched the BRRI Call
          Center, a dedicated agricultural helpline. Farmers can dial a
          designated number and speak directly with BRRI scientists and rice
          experts. Whether tackling sudden disease outbreaks, selecting
          salt-tolerant varieties for coastal areas, or deciding on irrigation
          under uncertain rainfall, farmers now have access to real-time,
          research-based advice. The call center is staffed by trained
          professionals, including agronomists, plant pathologists,
          entomologists, and climate specialists. Operated in Bengali, the
          service ensures accessibility regardless of literacy level. Farmers
          describe problems verbally and can share photos via messaging apps for
          more accurate diagnosis.
        </p>
        <p className="text-gray-700 md:text-lg leading-relaxed mb-6 text-justify">
          The initiative reflects the e-agriculture model promoted by the World
          Summit on the Information Society (WSIS, 2003), emphasizing ICT use
          for integrated agricultural services. Beyond advice, the call center
          also documents farmer queries, helping identify recurring issues,
          improve outreach materials, and strengthen research-extension
          linkages. With climate change driving more frequent floods, droughts,
          and temperature extremes, the Agromet Lab’s ability to translate
          weather and climate data into farmer-friendly advisories adds
          particular value.
        </p>
        <p className="text-gray-700 md:text-lg leading-relaxed mb-6 text-justify">
          Crucially, the call center transforms extension from one-way knowledge
          transfer to multi-way, farmer-driven communication. Farmers are active
          contributors, sharing field observations and indigenous knowledge,
          which creates a continuous feedback loop for adaptive agricultural
          development. The model aligns with BRRI’s strategic goals: increasing
          rice productivity, promoting smart farming, and ensuring no farmer is
          left behind due to geography or resources. It also supports national
          digital agriculture policies and Bangladesh’s vision for food security
          and rural prosperity.
        </p>

        <h2 className="text-xl md:text-2xl font-bold text-green-700 mb-2">
          Objective of the Call Center
        </h2>
        <p className="text-gray-700 md:text-lg leading-relaxed mb-2 text-justify">
          The primary goal of this call center is to deliver real-time, expert
          advice to rice farmers on various aspects of rice cultivation. This
          includes support on:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li>
            Selection of appropriate rice varieties based on season and region.
          </li>
          <li>Disease and pest identification and control strategies.</li>
          <li>Fertilizer and irrigation management.</li>
          <li>Weather and agro-climatic updates.</li>
          <li>Harvesting and post-harvest management.</li>
          <li>Any other field-specific query raised by the farmers.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-bold text-green-700 mt-8 mb-2">
          Details of the Call Center
        </h2>
        <p className="text-gray-700 md:text-lg leading-relaxed mb-2 text-justify">
          The call center is staffed by a team of scientists from the BRRI
          Agromet Lab.
        </p>
        <div className="text-gray-700 md:text-lg leading-relaxed mb-6 space-y-2">
          <p>
            <strong>Helpline Number:</strong> 09644300300
          </p>
          <p>
            <strong>Operational Hours:</strong> Expert support is available 24
            hours a day, while the helpline Desk is only available on working
            days from 9:00 AM to 5:00 PM.
          </p>
          <p>
            <strong>Languages Supported:</strong> Bengali (primary) and English
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 p-6 bg-white shadow-xl rounded-xl w-full mt-6 hover:shadow-2xl transition-shadow duration-300">
        {patrons.map((patron, index) => (
          <div
            key={index}
            className="text-center group hover:transform hover:scale-105 transition-all duration-300 p-4 rounded-lg hover:bg-gray-50 w-full md:w-auto flex flex-col items-center"
          >
            <h3 className="text-xl font-semibold mb-4 text-green-700 border-b-2 border-green-200 pb-2">
              {patron.title}
            </h3>
            <div className="relative overflow-hidden rounded-lg shadow-lg mb-3 group-hover:shadow-xl transition-shadow duration-300">
              <img
                src={patron.image}
                alt={patron.name}
                className="w-60 h-72 object-cover mx-auto border-2 border-gray-200 transition-colors duration-300"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </div>
            <h4 className="mt-3 text-lg font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-300">
              {patron.name}
            </h4>
            <p className="text-gray-600 mt-1 font-medium">
              {patron.designation}
            </p>
          </div>
        ))}
      </div>
      <div className="px-6 py-6 bg-white shadow-xl rounded-xl w-full mt-6 hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold mb-6 text-green-700 border-b-2 border-green-200 pb-3 text-center">
          Reviewed by
        </h3>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {reviewers.map((reviewer, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300 p-4 rounded-lg hover:bg-gray-50 w-full md:w-auto flex flex-col items-center"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg mb-3 group-hover:shadow-xl transition-shadow duration-300">
                <img
                  src={reviewer.image}
                  alt={reviewer.name}
                  className="w-60 h-72 object-cover mx-auto border-2 border-gray-200 transition-colors duration-300"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
              <h4 className="mt-3 text-lg font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                {reviewer.name}
              </h4>
              <p className="text-gray-600 mt-1 font-medium">
                {reviewer.designationLine1}
              </p>
              <p className="text-gray-600 font-medium">
                {reviewer.designationLine2}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 py-6 bg-white shadow-xl rounded-xl w-full mt-6 hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold mb-6 text-green-700 border-b-2 border-green-200 pb-3 text-center">
          Plan, Database & Execution By
        </h3>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 group hover:transform hover:scale-[1.02] transition-all duration-300 p-4 rounded-lg hover:bg-gray-50 w-full md:w-auto">
            <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <img
                src="/niaz.jpg" // replace with correct image path
                alt="Niaz Md. Farhat Rahman"
                className="w-60 h-72 object-cover border-2 border-gray-200 transition-colors duration-300"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </div>
            <div className="space-y-2 mt-3 md:mt-0">
              <h4 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                Niaz Md. Farhat Rahman
              </h4>
              <div className="space-y-1 text-gray-600">
                <p className="font-medium">Principal Scientific Officer</p>
                <p className="font-medium">Agricultural Statistics Division</p>
                <p className="font-medium">& Member, Agromet Lab</p>
                <p className="font-medium">
                  Bangladesh Rice Research Institute (BRRI)
                </p>
                <p className="font-medium">Gazipur-1701, Bangladesh.</p>
              </div>
              <div className="pt-2 space-y-1">
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span>{" "}
                  <a
                    href="mailto:niaz.sust@gmail.com"
                    className="text-green-600 hover:text-green-700 underline hover:no-underline transition-all duration-200"
                  >
                    niaz.sust@gmail.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Mobile:</span> +8801912700606
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Phone:</span> PABX
                  880-2-49272005-14 Ext. 395
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 bg-white shadow-xl rounded-xl w-full mt-6 hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold mb-6 text-green-700 border-b-2 border-green-200 pb-3 text-center">
          Development Team
        </h3>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {/* Fullstack Developer */}
          <div className="text-center group hover:transform hover:scale-105 transition-all duration-300 p-4 rounded-lg hover:bg-gray-50 w-full md:w-auto flex flex-col items-center">
            <div className="relative overflow-hidden rounded-lg shadow-lg mb-3 group-hover:shadow-xl transition-shadow duration-300">
              <img
                src="/riyad.jpg"
                alt="Riyad Ali Mollik"
                className="w-60 h-72 object-cover mx-auto border-2 border-gray-200 transition-colors duration-300"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </div>
            <h4 className="mt-3 text-lg font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-300">
              Riyad Ali Mollik
            </h4>
            <p className="text-gray-600 mt-1 font-medium">
              Fullstack Developer
            </p>
            <p className="text-gray-700 mt-2">
              <span className="font-semibold">Email:</span>{" "}
              <a
                href="mailto:mollikmdriyadh@gmail.com"
                className="text-green-600 hover:text-green-700 underline hover:no-underline transition-all duration-200"
              >
                mollikmdriyadh@gmail.com
              </a>
            </p>
            <p className="text-gray-700 mt-1">
              <span className="font-semibold">Mobile:</span> +8801786563606
            </p>
          </div>

          {/* Frontend Developer */}
          <div className="text-center group hover:transform hover:scale-105 transition-all duration-300 p-4 rounded-lg hover:bg-gray-50 w-full md:w-auto flex flex-col items-center">
            <div className="relative overflow-hidden rounded-lg shadow-lg mb-3 group-hover:shadow-xl transition-shadow duration-300">
              <img
                src="/faysal.JPG"
                alt="Faysal Ahmad Patwary"
                className="w-60 h-72 object-cover mx-auto border-2 border-gray-200 transition-colors duration-300"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </div>
            <h4 className="mt-3 text-lg font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-300">
              Faysal Ahmad Patwary
            </h4>
            <p className="text-gray-600 mt-1 font-medium">
              Frontend Developer and Designer
            </p>
            <p className="text-gray-700 mt-2">
              <span className="font-semibold">Email:</span>{" "}
              <a
                href="mailto:info.faysal.32@gmail.com"
                className="text-green-600 hover:text-green-700 underline hover:no-underline transition-all duration-200"
              >
                info.faysal.32@gmail.com
              </a>
            </p>
            <p className="text-gray-700 mt-1">
              <span className="font-semibold">Mobile:</span> +8801615553632
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

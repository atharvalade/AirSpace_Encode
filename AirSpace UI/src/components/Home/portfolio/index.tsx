"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

const Portfolio = () => {
  const router = useRouter();
  
  // Air rights property data
  const airRightsData = [
    {
      id: "fallsview-direct",
      title: "Fallsview Direct Rights",
      location: "Fallsview Boulevard",
      price: "$485",
      priceUnit: "per sq ft",
      change: "+9.2%",
      changeValue: "(+$41)",
      icon: "ph:waves-bold"
    },
    {
      id: "clifton-hill",
      title: "Clifton Hill View",
      location: "Victoria Avenue",
      price: "$395",
      priceUnit: "per sq ft",
      change: "+7.8%",
      changeValue: "(+$29)",
      icon: "ph:tree-bold"
    },
    {
      id: "niagara-parkway",
      title: "Niagara Parkway View",
      location: "6430 Niagara River Pky",
      price: "$468",
      priceUnit: "per sq ft",
      change: "+11.3%",
      changeValue: "(+$47)",
      icon: "ph:mountains-bold"
    }
  ];

  const handleDetailsClick = () => {
    router.push("/listings");
  };

  return (
    <section className="md:pt-28 sm:pt-24 pt-20 pb-28 bg-darkmode/30" id="portfolio">
      <div className="container mx-auto lg:max-w-screen-xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 items-center gap-20">
          <motion.div
            whileInView={{ y: 0, opacity: 1 }}
            initial={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -z-10 w-full h-full bg-gradient-radial from-primary/10 to-transparent opacity-70"></div>
            
            <div className="grid gap-6">
              {airRightsData.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-darkmode/50 backdrop-blur-md border border-dark_border/20 rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/20 p-3 rounded-full">
                        <Icon icon={item.icon} className="text-primary text-xl" />
                      </div>
                      <div>
                        <h3 className="text-white text-lg font-medium">{item.title}</h3>
                        <p className="text-muted text-sm">{item.location}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleDetailsClick}
                      className="bg-transparent hover:bg-primary/10 border border-primary/50 rounded-lg text-primary text-sm py-1 px-3 transition-all"
                    >
                      Details
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-muted text-sm">Current Value</p>
                      <p className="text-white text-xl font-bold">{item.price} <span className="text-muted text-sm font-normal">{item.priceUnit}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted text-sm">Annual Growth</p>
                      <p className="text-green-500 text-base font-medium">{item.change} <span className="text-sm">{item.changeValue}</span></p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            whileInView={{ y: 0, opacity: 1 }}
            initial={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="sm:text-28 text-18 text-muted mb-4">
              Property <span className="text-primary">Air Rights</span>
            </p>
            <h2 className="text-white sm:text-40 text-30 mb-4 font-medium">
              Secure your view rights with blockchain technology
            </h2>
            <p className="text-muted text-opacity-60 text-18 mb-8">
              Our platform enables property owners and investors to tokenize and trade
              air rights securely and transparently, with real-time market data and verified property information.
            </p>

            <div className="space-y-6">
              {[
                {
                  title: "Tokenized Air Rights",
                  icon: "/images/portfolio/icon-wallet.svg",
                  description: "Convert physical air rights into digital tokens backed by legal documentation"
                },
                {
                  title: "Smart Contract Protection",
                  icon: "/images/portfolio/icon-vault.svg",
                  description: "Automated enforcement of terms and conditions through blockchain technology"
                },
                {
                  title: "Government Verified",
                  icon: "/images/portfolio/icon-mobileapp.svg",
                  description: "All listings are verified with local zoning and property records"
                }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-5">
                  <div className="bg-primary p-4 rounded-full bg-opacity-20 w-fit shrink-0">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={35}
                      height={35}
                    />
                  </div>
                  <div>
                    <h4 className="text-white text-lg font-medium">{item.title}</h4>
                    <p className="text-muted text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

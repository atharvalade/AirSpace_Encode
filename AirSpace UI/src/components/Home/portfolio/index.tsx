"use client";
import Image from "next/image";
import { portfolioData } from "@/app/api/data";
import { motion } from "framer-motion";

const Portfolio = () => {
  return (
    <section className="md:pt-28 sm:pt-24 pt-20 pb-28" id="portfolio">
      <div className="container mx-auto lg:max-w-screen-xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 items-center gap-20">
          <motion.div
            whileInView={{ y: 0, opacity: 1 }}
            initial={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:-ml-32"
          >
            <Image
              src="/images/portfolio/img-portfolio.png"
              alt="Crypto Portfolio"
              width={780}
              height={700}
            />
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
            <p className="text-muted text-opacity-60 text-18">
              Our platform enables property owners and investors to tokenize and trade
              <br className="md:block hidden" /> air rights securely and transparently.
            </p>

            <table className="w-full sm:w-[80%]">
              <tbody>
                {portfolioData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-dark_border border-opacity-10"
                  >
                    <td className="py-5">
                      <div className="bg-primary p-4 rounded-full bg-opacity-20 w-fit">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={35}
                          height={35}
                        />
                      </div>
                    </td>
                    <td className="py-5">
                      <h4 className="text-muted sm:text-28 text-22 ml-5">
                        {item.title}
                      </h4>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

import React from "react";
import bg from "../assets/Background.jpg";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative w-full h-screen">
        <img
          src={bg}
          alt="Hero Background"
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col justify-center  items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Discover Amazing <span className="text-fuchsia-400">Events</span>
          </h1>
          <p className="text-lg md:text-2xl mb-6">
           <span className="text-fuchsia-400">Book tickets</span>, join experiences, and enjoy live events near you.
          </p>
          <Link
            to="/events"
            className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition duration-200"
          >
            Browse Events
          </Link>
        </div>
      </div>

      {/* App Promo Section */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Phone mock */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <div className="w-[260px] h-[520px] rounded-[2.4rem] p-2 bg-gradient-to-br from-fuchsia-500/40 to-purple-600/40">
                <div className="w-full h-full rounded-[2rem] bg-gray-900 overflow-hidden flex flex-col">
                  <div className="h-6 flex items-center justify-center">
                    <div className="h-1.5 w-24 bg-gray-700 rounded-full mt-2" />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="h-28 rounded-xl bg-gradient-to-br from-purple-600/40 to-fuchsia-500/30" />
                    <div className="grid grid-cols-3 gap-3">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-16 rounded-lg bg-white/5" />
                      ))}
                    </div>
                    <div className="h-24 rounded-xl bg-white/5" />
                  </div>
                </div>
              </div>
              <div className="absolute -inset-4 -z-10 bg-gradient-to-t from-purple-700/30 via-transparent to-transparent blur-3xl" />
            </div>
          </div>

          {/* Text + bullets */}
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Your Scene, <span className="text-fuchsia-400">Your Pocket!</span>
            </h2>
            <div className="h-px bg-white/10 my-4" />
            <ul className="space-y-4 text-sm md:text-base text-gray-200">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-400" />
                <p>
                  <span className="font-semibold">Instant Access, Instant Vibes</span> — get event updates and deals in real-time.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-400" />
                <p>
                  <span className="font-semibold">Connect and Share</span> — make friends, join communities, and share moments.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-400" />
                <p>
                  <span className="font-semibold">Plan Like a Pro</span> — set reminders and discover hotspots with ease.
                </p>
              </li>
            </ul>

            <p className="mt-8 text-lg font-semibold">Ready To Party Smarter?</p>
            <div className="mt-3 flex gap-3">
              <button className="px-4 py-2 rounded-md bg-white text-black font-semibold hover:bg-gray-100 transition">Get it on Google Play</button>
              <button className="px-4 py-2 rounded-md border border-white/30 hover:border-white/60">Download on the App Store</button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-black text-white py-14">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { value: "15L+", label: "Happy Partygoers Served! 🎉" },
            { value: "100+", label: "Cities Covered!" },
            { value: "10K+", label: "Events Hosted" },
            { value: "2500+", label: "Companies We Collab With" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-4">
              <div className="p-[2px] rounded-full bg-gradient-to-tr from-fuchsia-500 to-purple-500">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-black grid place-items-center">
                  <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
                    {item.value}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 text-sm md:text-base max-w-[12rem]">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-gray-400">How it works</p>
          <h3 className="text-center text-2xl md:text-4xl font-extrabold mt-1">
            We Make Your <span className="text-fuchsia-400">Nightlife</span> Easy
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
            {[
              {
                step: "1",
                title: (
                  <>
                    Discover Your <span className="text-fuchsia-400">Scene</span>
                  </>
                ),
                desc: "Discover your perfect event, effortlessly",
              },
              {
                step: "2",
                title: "Seamless Purchasing",
                desc: "Secure your spot with a few clicks — it’s that simple.",
              },
              {
                step: "3",
                title: (
                  <>
                    Get <span className="text-fuchsia-400">Sorted</span>
                  </>
                ),
                desc: "Turn moments into memories.",
              },
            ].map((card) => (
              <div key={card.step} className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full grid place-items-center bg-gradient-to-tr from-fuchsia-500 to-purple-500 text-black font-extrabold">
                  <span className="text-white">{card.step}</span>
                </div>
                <h4 className="mt-4 text-xl font-semibold">{card.title}</h4>
                <p className="text-gray-300 mt-2">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

import Aboutpage from "../assets/Aboutpage.jpg";
import Aboutone from "../assets/AboutOne.jpg";
import AboutTwo from "../assets/AboutTwo.jpg"; // ✅ corrected spelling


const About = () => {
  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <div className="relative">
        <img
          src={Aboutpage}
          alt="About Banner"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-5xl font-extrabold text-white">About Us</h1>
        </div>
      </div>

      {/* About Us Text */}
      <section className="max-w-5xl mx-auto px-6 py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
        <p className="text-gray-700 leading-relaxed">
          Welcome to <span className="font-semibold">Live101</span>, your trusted
          platform for booking live artists and entertainers for your house
          parties, corporate events, weddings, or festivals. We connect you with
          a diverse selection of talented artists—musicians, singers, DJs,
          comedians, dancers, or emcees.  
          <br />
          <br />
          With a user-friendly platform and personalized service, we take pride
          in helping you find the perfectly curated act. Live101 ensures a
          seamless live entertainment experience from discovery to booking,
          making events hassle-free and exciting.
        </p>
      </section>

      {/* Our Story Section */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side Text */}
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              Music is a universal language that communicates with our souls.
              The best music makes us dance, sing, and forget our worries. But
              finding quality live artists within budget has always been a
              hassle.  
              <br />
              <br />
              After extensive research, we discovered that there are over 10
              lakh freelance artists seeking opportunities, while clients
              struggle to find the right match. This inspired{" "}
              <span className="font-semibold">Live101</span>—a live artist
              booking platform bridging the gap between artists and event
              organizers.  
              <br />
              <br />
              Live101 is fair, transparent, and provides opportunities for
              singers, DJs, bands, comedians, dancers, and many more to showcase
              their talent while helping clients make unforgettable memories.
            </p>
          </div>

          {/* Right Side Images */}
          <div className="grid grid-cols-2 gap-4">
            <img
              src={Aboutone}
              alt="Artist Performing"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
            <img
              src={AboutTwo}
              alt="Live Concert"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

import Navbar from "../../layouts/navbar/Navbar";
import Searchbar from "../../layouts/searchbar/Searchbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="flex justify-center m-4">
        <h1>Where you off to?</h1>
      </div>
      <Searchbar />
    </>
  );
};

export default Home;

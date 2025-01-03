import SellerRegistrationForm from "../shared/SellerRegistrationForm";

const SellerProfilePage = () => {
  return (
    <main className="w-full flex-col flex gap-5">
      <h4 className="text-xl text-muted-foreground font-semibold  ">
        Update seller information
      </h4>
      <div className="flex items-center  ">
        <SellerRegistrationForm />
      </div>
    </main>
  );
};

export default SellerProfilePage;

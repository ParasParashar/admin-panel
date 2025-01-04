import SellerRegistrationForm from "../shared/SellerRegistrationForm";

const SellerProfilePage = () => {
  return (
    <main className="w-full flex-col flex gap-5 items-center justify-center">
      <h4 className="text-xl text-muted-foreground font-semibold  ">
        Update seller information
      </h4>
      <div className="flex items-center w-full justify-center h-full  ">
        <SellerRegistrationForm />
      </div>
    </main>
  );
};

export default SellerProfilePage;

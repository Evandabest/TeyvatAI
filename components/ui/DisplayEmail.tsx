"use client"



const DisplayEmail: React.FC<any> = ( prop : any) => {
  const email = prop.user.email;
  console.log(email);
  return (
    <div>
      <h2>User Email</h2>
      <p>{email}</p>
    </div>
  );
};

export default DisplayEmail;
"use client"

interface DisplayEmailProps {
      user: {
          id: string;
          aud: string;
          role: string;
          email: string;
          email_confirmed_at: string;
          phone: string;
          confirmation_sent_at: string;
          confirmed_at: string;
          last_sign_in_at: string;
          app_metadata: object;
          user_metadata: object;
          identities: Array<any>;
          created_at: string;
          updated_at: string;
          is_anonymous: boolean;
      };
  }



const DisplayEmail: React.FC<DisplayEmailProps> = ({ user }: DisplayEmailProps) => {
  return (
    <div>
      <h2>User Email</h2>
      <p>{user.email}</p>
    </div>
  );
};

export default DisplayEmail;
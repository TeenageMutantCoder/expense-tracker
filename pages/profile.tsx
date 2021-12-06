import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Button, Heading } from "@chakra-ui/react";
import { useLocalStorage } from "usehooks-ts";

const Profile: NextPage = () => {
  const router = useRouter();
  const [user, setUser] = useLocalStorage("jwt", null);

  useEffect(() => {
    if (!user) {
      router.push("/log-in");
    }
    fetch("/api/user", { headers: { Authorization: "Bearer " + user } })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, [user, router]);

  return (
    <div className="Profile">
      <Heading align="center">Profile</Heading>
      <Button
        onClick={(e) => {
          setUser(null);
        }}
      >
        Clear data
      </Button>
    </div>
  );
};

export default Profile;

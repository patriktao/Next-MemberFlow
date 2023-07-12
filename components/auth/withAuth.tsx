import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "../../pages/api/authAPI/authAPI";

const withAuth = <P extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<P>
) => {
  const Wrapper = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const user = localStorage.getItem("authToken");
        if (!user) {
          localStorage.removeItem("authToken");
          router.push("/");
        }
      };

      checkAuth();
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;

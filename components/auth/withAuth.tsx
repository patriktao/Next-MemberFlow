import React from "react";
import Router from "next/router";
import { getAuth } from "firebase/auth";

const withAuth = (WrappedComponent: React.ComponentType) => {
  return class extends React.Component {
    
    static async getInitialProps(ctx) {
      const currentUser = getAuth().currentUser;
      let authenticated = false;

      if (currentUser) {
        authenticated = true;
      }

      if (!authenticated) {
        if (typeof window === "undefined") {
          ctx.res.writeHead(302, { Location: "/" });
          ctx.res.end();
        } else {
          Router.push("/");
        }
      }

      const pageProps = WrappedComponent.getInitialProps
        ? await WrappedComponent.getInitialProps(ctx)
        : {};

      return { ...pageProps };
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withAuth;

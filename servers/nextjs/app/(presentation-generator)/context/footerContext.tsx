"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  FooterProperties,
  useFooterService,
} from "../services/footerSqliteService";

// Default footer properties
export const defaultFooterProperties: FooterProperties = {
  logoProperties: {
    showLogo: true,
    logoPosition: "left",
    opacity: 0.8,
    logoImage: {
      light: "",
      dark: "",
    },
  },
  logoScale: 1.0,
  logoOffset: {
    x: 0,
    y: 0,
  },
  footerMessage: {
    showMessage: true,
    opacity: 1.0,
    fontSize: 12,
    message: "Copyright © 2025",
  },
};

interface FooterContextProps {
  footerProperties: FooterProperties;
  setFooterProperties: (newProperties: FooterProperties | ((prev: FooterProperties) => FooterProperties)) => void;
  resetFooterProperties: () => Promise<void>;
  saveFooterProperties: (newProperties: FooterProperties) => Promise<void>;
}

const FooterContext = createContext<FooterContextProps | undefined>(undefined);

export const useFooterContext = () => {
  const context = useContext(FooterContext);
  if (!context) {
    throw new Error("useFooterContext must be used within a FooterProvider");
  }
  return context;
};

export const FooterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [footerProperties, setFooterProperties] = useState<FooterProperties>(defaultFooterProperties);
  const footerService = useFooterService();
  const userId = "local-user"; // Since this is a desktop app, we can use a fixed ID

  // Load footer properties only once when the provider mounts
  useEffect(() => {
    const loadFooterProperties = async () => {
      try {
        const properties = await footerService.getFooterProperties(userId);
        if (properties) {
          setFooterProperties(properties);
        }
      } catch (error) {
        console.error("Failed to load footer properties:", error);
      }
    };

    loadFooterProperties();
  }, []); // Empty dependency array ensures this runs only once

  // const updateFooterProperties = async (newProperties: FooterProperties) => {
  //   try {
  //     const success = await footerService.saveFooterProperties(userId, newProperties);
  //     if (success) {
  //       setFooterProperties(newProperties);
  //     }
  //   } catch (error) {
  //     console.error("Failed to update footer properties:", error);
  //   }
  // };

  const resetFooterProperties = async () => {
    try {
      const success = await footerService.resetFooterProperties(userId, defaultFooterProperties);
      if (success) {
        setFooterProperties(defaultFooterProperties);
      }
    } catch (error) {
      console.error("Failed to reset footer properties:", error);
    }
  };
  const saveFooterProperties = async (newProperties: FooterProperties) => {
    try {
      const success = await footerService.saveFooterProperties(userId, newProperties);
      if (success) {
        setFooterProperties(newProperties);
      }
    } catch (error) {
      console.error("Failed to save footer properties:", error);
    }
  };

  return (
    <FooterContext.Provider
      value={{
        footerProperties,
        // updateFooterProperties,
        setFooterProperties,
        resetFooterProperties,
        saveFooterProperties,
      }}
    >
      {children}
    </FooterContext.Provider>
  );
};

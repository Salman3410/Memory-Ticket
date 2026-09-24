import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import CustomAlert from "../components/common/CustomAlert";

const AlertContext = createContext(null);

function AlertProvider({ children }) {
  const [alert, setAlert] = useState({
    visible: false,
    type: "info",
    icon: null,
    title: "",
    message: "",
    confirmText: "OK",
    cancelText: "Cancel",
    showCancel: false,
    onConfirm: null,
    onCancel: null,
  });

  const hideAlert = useCallback(() => {
    setAlert((currentAlert) => ({
      ...currentAlert,
      visible: false,
    }));
  }, []);

  const showAlert = useCallback(
    ({
      type = "info",
      icon = null,
      title = "",
      message = "",
      confirmText = "OK",
      cancelText = "Cancel",
      showCancel = false,
      onConfirm = null,
      onCancel = null,
    }) => {
      setAlert({
        visible: true,
        type,
        icon,
        title,
        message,
        confirmText,
        cancelText,
        showCancel,
        onConfirm,
        onCancel,
      });
    },
    [],
  );

  const handleConfirm = useCallback(async () => {
    const confirmAction = alert.onConfirm;

    hideAlert();

    if (typeof confirmAction === "function") {
      try {
        await confirmAction();
      } catch (error) {
        console.error(
          "Custom alert confirm error:",
          error,
        );
      }
    }
  }, [alert.onConfirm, hideAlert]);

  const handleCancel = useCallback(async () => {
    const cancelAction = alert.onCancel;

    hideAlert();

    if (typeof cancelAction === "function") {
      try {
        await cancelAction();
      } catch (error) {
        console.error(
          "Custom alert cancel error:",
          error,
        );
      }
    }
  }, [alert.onCancel, hideAlert]);

  const value = useMemo(
    () => ({
      showAlert,
      hideAlert,
    }),
    [showAlert, hideAlert],
  );

  return (
    <AlertContext.Provider value={value}>
      {children}

      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        icon={alert.icon}
        title={alert.title}
        message={alert.message}
        confirmText={alert.confirmText}
        cancelText={alert.cancelText}
        showCancel={alert.showCancel}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </AlertContext.Provider>
  );
}

export function useAppAlert() {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error(
      "useAppAlert must be used inside AlertProvider.",
    );
  }

  return context;
}

export default AlertProvider;

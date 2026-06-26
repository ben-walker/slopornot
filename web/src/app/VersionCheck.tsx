import { useEffect, useRef } from "react";
import { Anchor } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";

const VERSION_URL = "/version.json";
const POLL_INTERVAL_MS = 5 * 60 * 1000;
const NOTIFICATION_ID = "version-update";

async function fetchVersion(): Promise<string> {
  const response = await fetch(VERSION_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to fetch version: ${String(response.status)}`);
  }

  const data: unknown = await response.json();

  if (
    !data
    || typeof data !== "object"
    || !("version" in data)
    || typeof data.version !== "string"
  ) {
    throw new Error("Malformed version payload");
  }

  return data.version;
}

function VersionCheck() {
  const loadedVersion = useRef<string>(undefined);

  const { data: version } = useQuery({
    queryKey: ["version"],
    queryFn: fetchVersion,
    refetchInterval: POLL_INTERVAL_MS,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  useEffect(() => {
    if (!version) {
      return;
    }

    if (loadedVersion.current === undefined) {
      loadedVersion.current = version;
      return;
    }

    if (version !== loadedVersion.current) {
      notifications.show({
        id: NOTIFICATION_ID,
        color: "teal",
        autoClose: false,
        title: "New version available",
        message: (
          <Anchor
            component="button"
            onClick={() => {
              window.location.reload();
            }}
            size="sm"
          >
            Refresh to get the latest
          </Anchor>
        ),
      });
    }
  }, [version]);

  return null;
}

export { VersionCheck };

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";

import Error from "../components/error";
import Container from "../components/container";
import Block from "../components/block";

import useWidgetAPI from "utils/proxy/use-widget-api";

const Chart = dynamic(() => import("../components/chart"), { ssr: false });

const pointsLimit = 15;

export default function Component({ service }) {
  const { t } = useTranslation();

  const [dataPoints, setDataPoints] = useState(new Array(pointsLimit).fill({ value: 0 }, 0, pointsLimit));

  const { data, error } = useWidgetAPI(service.widget, 'cpu', {
    refreshInterval: 1000,
  });

  const { data: systemData, error: systemError } = useWidgetAPI(service.widget, 'system');

  useEffect(() => {
    if (data) {
      setDataPoints((prevDataPoints) => {
        const newDataPoints = [...prevDataPoints, { value: data.total }];
          if (newDataPoints.length > pointsLimit) {
              newDataPoints.shift();
          }
          return newDataPoints;
      });
    }
  }, [data]);

  if (error) {
    return <Container><Error error={error} /></Container>;
  }

  if (!data) {
    return <Container><Block position="bottom-3 left-3">-</Block></Container>;
  }

  return (
    <Container>
      <Chart
        dataPoints={dataPoints}
        label={[t("resources.used")]}
        formatter={(value) => t("common.number", {
          value,
          style: "unit",
          unit: "percent",
          maximumFractionDigits: 0,
          })}
      />

      {systemData && !systemError && (
        <Block position="bottom-3 left-3">
          {systemData.linux_distro && (
            <div className="text-xs opacity-50">
              {systemData.linux_distro}
            </div>
          )}
          {systemData.os_version && (
            <div className="text-xs opacity-50">
              {systemData.os_version}
            </div>
          )}
          {systemData.hostname && (
            <div className="text-xs opacity-75">
              {systemData.hostname}
            </div>
          )}
        </Block>
      )}

      <Block position="bottom-3 right-3">
        <div className="text-xs font-bold opacity-75">
            {t("common.number", {
              value: data.total,
              style: "unit",
              unit: "percent",
              maximumFractionDigits: 0,
            })} {t("resources.used")}
          </div>
      </Block>
    </Container>
  );
}

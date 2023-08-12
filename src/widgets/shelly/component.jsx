import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();

  const { widget } = service;
  const { data: stateData, error: stateError } = useWidgetAPI(widget, "status");

  if (stateError) {
    return <Container service={service} error={stateError} />;
  }

  if (!stateData) {
    return (
      <Container service={service}>,
        <Block label="shelly.channel_1" />
        <Block label="shelly.channel_2" />
        <Block label="shelly.fw_update" />
      </Container>
    );
  }

  if (stateData.meters.length >= 2) {  // has 2 or more relays
    return (
      <Container service={service}>
        <Block label="shelly.channel_1" value={`${t("common.number", { value: stateData.meters[0].power })} ${t("shelly.watt")}`} />
        <Block label="shelly.channel_2" value={`${t("common.number", { value: stateData.meters[1].power })} ${t("shelly.watt")}`} />
        <Block label="shelly.fw_update" value={`${t("shelly.up_to_date")} `} />
      </Container>
    );
  } else {
    return (
      <Container service={service}>
        <Block label="shelly.channel_1" value={`${t("common.number", { value: stateData.meters[0].power })} ${t("shelly.watt")}`} />
        <Block label="shelly.fw_update" value={`${t("shelly.up_to_date")} `} />
      </Container>
    );    
  }

}

      //<Container service={service}>
      //  <Block label="shelly.pv_power" value={`${t("common.number", { value: stateData.result.pvPower })} `} />
      //  <Block label="shelly.grid_power" value={`${t("common.number", { value: stateData.result.gridPower })} `} />
      //  <Block label="shelly.home_power" value={`${t("common.number", { value: stateData.result.homePower })} `} />
      //  <Block label="shelly.charge_power" value={`${t("common.number", { value: stateData.result.loadpoints[0].chargePower })} ${t("shelly.watt")}`} />
      //</Container>
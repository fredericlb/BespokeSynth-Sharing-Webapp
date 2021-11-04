import { gql, useMutation } from "@apollo/client";
import { mergeStyleSets } from "@fluentui/merge-styles";
import { Icon } from "@fluentui/react";
import useUmami from "@parcellab/react-use-umami";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";

const $ = mergeStyleSets({
  block: {
    background: "#343434",
    padding: 10,
    marginTop: 30,
    fontSize: "1.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  errorIcon: {
    color: "red",
  },
  successIcon: {
    border: "2px solid #ABABAB",
    borderRadius: "50%",
    padding: 5,
    marginBottom: 10,
  },
});

const enableTokenGQL = gql`
  mutation ($uuid: String!, $token: String!) {
    enableToken(uuid: $uuid, token: $token) {
      uuid
      enabled
    }
  }
`;

const TokenActivation: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  useUmami(`/validation/access-token/${uuid}`);

  const [enableToken, etInfos] = useMutation(enableTokenGQL);
  const [requestSent, setRequestSent] = useState(false);
  const { t } = useTranslation();

  const token = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
  }, []);

  useEffect(() => {
    if (token !== null && !requestSent) {
      setRequestSent(true);
      enableToken({ variables: { uuid, token } });
    }
  }, [enableToken, requestSent, token, uuid]);

  if (!token) {
    return (
      <div className={$.block}>
        <div>
          <Icon iconName="error" className={$.errorIcon} />
        </div>
        <div>{t("TokenValidation.missing")}</div>
      </div>
    );
  }

  if (!requestSent || etInfos.loading) {
    return <Loader full />;
  }

  if (etInfos.error) {
    return (
      <div className={$.block}>
        <div>
          <Icon iconName="error" className={$.errorIcon} />
        </div>
        <div>{t("TokenValidation.error")}</div>
      </div>
    );
  }

  if (etInfos.data && etInfos.data.enableToken?.enabled) {
    return (
      <div className={$.block}>
        <div>
          <Icon iconName="checkmark" className={$.successIcon} />
        </div>
        <div>{t("TokenValidation.success")}</div>
      </div>
    );
  }

  return <div />;
};

export default TokenActivation;

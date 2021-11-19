import { useMutation, gql, useQuery } from "@apollo/client";
import { mergeStyleSets } from "@fluentui/merge-styles";
import {
  ComboBox,
  DefaultButton,
  PrimaryButton,
  ProgressIndicator,
  Stack,
} from "@fluentui/react";
import useUmami from "@parcellab/react-use-umami";
import React, { useEffect, useState } from "react";
import { Control, FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import versions from "../../../bespokeVersions.json";
import Attachments from "../components/Attachments";
import ControlledTextField from "../components/ControlledTextField";
import SectionTitle from "../components/Typography";

const createActionTokenGQL = gql`
  mutation ($mail: String!) {
    createActionToken(mail: $mail) {
      uuid
    }
  }
`;

const checkTokenGQL = gql`
  query ($uuid: String!) {
    checkActionToken(uuid: $uuid) {
      uuid
      enabled
    }
  }
`;

const uploadPatchGQL = gql`
  mutation (
    $files: [Upload!]!
    $tokenUuid: String!
    $title: String!
    $author: String!
    $mail: String!
    $tags: [String!]!
    $summary: String!
    $version: String!
    $description: String
  ) {
    uploadPatch(
      tokenUuid: $tokenUuid
      uploadInfo: {
        title: $title
        author: $author
        mail: $mail
        tags: $tags
        summary: $summary
        description: $description
        version: $version
      }
      files: $files
    )
  }
`;

const $ = mergeStyleSets({
  back: {
    marginTop: 40,
    marginBottom: 0,
  },
  title: {
    fontSize: "1.5rem",
    paddingBottom: 4,
    borderBottom: "1px solid #787878",
    paddingTop: 20,
    marginBottom: 20,
    textTransform: "lowercase",
  },
  error: {
    marginTop: 20,
    background: "#cc1111",
    color: "white",
    padding: 5,
    boxSizing: "border-box",
    height: 40,
    display: "flex",
    alignItems: "center",
    paddingLeft: 20,
    marginBottom: 20,
  },
  finished: {
    marginTop: 20,
    background: "#11bb11",
    color: "white",
    padding: 5,
    boxSizing: "border-box",
    height: 40,
    display: "flex",
    alignItems: "center",
    paddingLeft: 20,
  },
});

interface Form extends Record<string, any> {
  title: string;
}

const isValidEmail = (email: string) =>
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );

const isValidTags = (str: string) => {
  if (str === "") {
    return true;
  }
  const tags = str.split(",");
  return tags.every((s) => s.trim().match(/[a-zA-Z0-9]+/)) && tags.length <= 5;
};

enum Status {
  NotSent = 0,
  WaitingForMail = 1,
  SendingPatch = 2,
  Error = 3,
  Finished = 4,
}

interface UploadInfo {
  author: string;
  mail: string;
  summary: string;
  tags: string[];
  title: string;
  description?: string;
  version: string;
}

const ValidationTokenCheck: React.FC<{ uuid: string; onComplete: () => void }> =
  ({ uuid, onComplete }) => {
    const [fired, setFired] = useState(false);
    const { data } = useQuery(checkTokenGQL, {
      variables: { uuid },
      pollInterval: 1000,
    });
    useEffect(() => {
      if (data?.checkActionToken?.enabled && !fired) {
        setFired(true);
        onComplete();
      }
    }, [data, fired, onComplete]);

    return null;
  };

const Upload: React.FC = () => {
  useUmami(`/upload`);

  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [version, setVersion] = useState<string>(
    versions.filter(({ isDefault }) => isDefault)[0].version
  );
  const [hasAttachmentsError, setAttachmentsError] = useState(false);
  const [status, setStatus] = useState(Status.NotSent);
  const [createActionToken, catInfos] = useMutation(createActionTokenGQL);
  const [uploadPatch, upInfos] = useMutation(uploadPatchGQL);
  const [emailTokenUuid, setEmailTokenUuid] = useState<string>();
  const [uploadRequestSent, setUploadRequestSent] = useState(false);
  const h = useHistory();
  const [uploadInfo, setUploadInfo] = useState<UploadInfo>();
  const { handleSubmit, control } = useForm<Form>({
    defaultValues: {
      title: "",
    },
    reValidateMode: "onSubmit",
    mode: "all",
  });

  const ctrl = control as Control<FieldValues, object>;  /* eslint-disable-line */
  const onSubmit = (data: Record<string, string>) => {
    const info = {
      ...data,
      tags: data.tags.split(",").map((x) => x.trim()),
      version,
    } as UploadInfo;
    setUploadInfo(info);
    if (files.length === 0 || hasAttachmentsError) {
      setStatus(Status.NotSent);
      return;
    }
    setUploadRequestSent(false);
    setEmailTokenUuid(undefined);
    createActionToken({
      variables: {
        mail: info.mail,
      },
    });
    setStatus(Status.WaitingForMail);
    /* setTimeout(() => setStatus(Status.SendingPatch), 5000);
    setTimeout(() => setStatus(Status.Finished), 15000); */
  };

  useEffect(() => {
    if (catInfos.error && status === Status.WaitingForMail) {
      setStatus(Status.Error);
      // eslint-disable-next-line no-console
      console.error(catInfos.error);
    }
  }, [catInfos.error, status]);

  useEffect(() => {
    if (!emailTokenUuid && catInfos.data) {
      setEmailTokenUuid(catInfos.data.createActionToken?.uuid);
    }
  }, [catInfos.data, emailTokenUuid]);

  useEffect(() => {
    if (status === Status.SendingPatch && !uploadRequestSent) {
      setUploadRequestSent(true);
      uploadPatch({
        variables: {
          tokenUuid: emailTokenUuid,
          ...uploadInfo,
          files,
        },
      });
    }
  }, [
    emailTokenUuid,
    files,
    status,
    uploadInfo,
    uploadPatch,
    uploadRequestSent,
  ]);

  useEffect(() => {
    if (status !== Status.SendingPatch || !uploadRequestSent) {
      return;
    }
    if (upInfos.error) {
      setStatus(Status.Error);
      // eslint-disable-next-line no-console
      console.error(upInfos.error);
    } else if (upInfos.data?.uploadPatch != null) {
      setStatus(Status.Finished);
    }
  }, [upInfos, status, uploadRequestSent]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DefaultButton
        onClick={() => h.goBack()}
        iconProps={{ iconName: "back" }}
        className={$.back}
      >
        {t("Patch.back")}
      </DefaultButton>
      <Stack>
        <SectionTitle>{t("Upload.name")}</SectionTitle>
        <h3 className={$.title}>{t("Upload.metadata")}</h3>
        <Stack>
          <ControlledTextField
            name="title"
            label={t("Upload.patchTitle")}
            control={ctrl}
            rules={{ required: true, minLength: 3 }}
          />
          <Stack horizontal gap={12}>
            <Stack grow>
              <ControlledTextField
                label={t("Upload.patchAuthor")}
                name="author"
                control={ctrl}
                rules={{ required: true, minLength: 3 }}
              />
            </Stack>
            <Stack grow>
              <ControlledTextField
                label={t("Upload.patchMail")}
                description={t("Upload.patchMailDescription")}
                control={ctrl}
                name="mail"
                disabled={![Status.NotSent, Status.Error].includes(status)}
                rules={{ required: true, validate: isValidEmail }}
              />
            </Stack>
          </Stack>
          <Stack horizontal gap={12}>
            <Stack grow>
              <ControlledTextField
                label={t("Upload.patchTags")}
                control={ctrl}
                name="tags"
                rules={{ validate: isValidTags }}
              />
            </Stack>
            <Stack>
              <ComboBox
                selectedKey={version}
                label="App version"
                onChange={(_1, _2, c) =>
                  c !== undefined ? setVersion(versions[c].version) : null
                }
                options={versions.map(({ version: v }) => ({
                  key: v,
                  text: v,
                }))}
              />
            </Stack>
          </Stack>

          <ControlledTextField
            multiline
            label={t("Upload.patchSummary")}
            control={ctrl}
            rules={{ required: true, maxLength: 240 }}
            name="summary"
            msgVars={{ len: "240" }}
          />
        </Stack>
        <h3 className={$.title}>{t("Upload.attachments")}</h3>
        <Attachments
          setFiles={setFiles}
          files={files}
          setError={setAttachmentsError}
        />
        <h3 className={$.title}>{t("Upload.description")}</h3>
        <ControlledTextField
          control={ctrl}
          multiline
          rows={10}
          label={t("Upload.descriptionDescription")}
          name="description"
          rules={{ maxLength: 20000 }}
          msgVars={{ len: "20000" }}
        />
        <Stack style={{ marginTop: 20 }}>
          {[Status.WaitingForMail, Status.SendingPatch].includes(status) && (
            <ProgressIndicator
              label={t(
                status === Status.WaitingForMail
                  ? "Upload.waitingForMail"
                  : "Upload.sendingPatch"
              )}
            />
          )}
          {status === Status.Finished && (
            <div className={$.finished}>{t("Upload.finished")}</div>
          )}
          {status === Status.Error && (
            <>
              <div className={$.error}>{t("Upload.error")}</div>
              <PrimaryButton onClick={() => setStatus(Status.NotSent)}>
                {t("Upload.retry")}
              </PrimaryButton>
            </>
          )}
          {[Status.NotSent].includes(status) && (
            <PrimaryButton type="submit">{t("Upload.send")}</PrimaryButton>
          )}
        </Stack>
      </Stack>
      {status === Status.WaitingForMail && emailTokenUuid && (
        <ValidationTokenCheck
          uuid={emailTokenUuid}
          onComplete={() => setStatus(Status.SendingPatch)}
        />
      )}
    </form>
  );
};

export default Upload;

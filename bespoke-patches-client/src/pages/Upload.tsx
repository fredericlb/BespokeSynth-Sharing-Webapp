import { mergeStyleSets } from "@fluentui/merge-styles";
import { PrimaryButton, ProgressIndicator, Stack } from "@fluentui/react";
import React, { useState } from "react";
import { Control, FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Attachments from "../components/Attachments";
import ControlledTextField from "../components/ControlledTextField";
import SectionTitle from "../components/Typography";

const $ = mergeStyleSets({
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

const Upload: React.FC = () => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [hasAttachmentsError, setAttachmentsError] = useState(false);
  const [status, setStatus] = useState(Status.NotSent);

  const { handleSubmit, control } = useForm<Form>({
    defaultValues: {
      title: "",
    },
    reValidateMode: "onSubmit",
    mode: "all",
  });

  const ctrl = control as Control<FieldValues, object>;  /* eslint-disable-line */
  const onSubmit = (data: unknown) => {
    if (files.length === 0 || hasAttachmentsError) {
      setStatus(Status.NotSent);
      return;
    }
    setStatus(Status.WaitingForMail);
    setTimeout(() => setStatus(Status.SendingPatch), 5000);
    setTimeout(() => setStatus(Status.Finished), 15000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          <ControlledTextField
            label={t("Upload.patchTags")}
            control={ctrl}
            name="tags"
            rules={{ validate: isValidTags }}
          />
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
            <div className={$.error}>{t("Upload.error")}</div>
          )}
          {[Status.NotSent, Status.Error].includes(status) && (
            <PrimaryButton type="submit">{t("Upload.send")}</PrimaryButton>
          )}
        </Stack>
      </Stack>
    </form>
  );
};

export default Upload;

import { mergeStyleSets } from "@fluentui/merge-styles";
import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  IconButton,
  ProgressIndicator,
} from "@fluentui/react";
import React, { useCallback, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";

const $ = mergeStyleSets({
  drop: {
    border: "3px dashed #898989",
    marginTop: "20px !important",
    marginBottom: 20,
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    p: {
      fontStyle: "italic",
    },
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
  },
});

interface FileInfos {
  name: string;
  type: "audio" | "image" | "bsk";
  size: number;
}

const MAX_SIZE = 70 * 1024;

const columns: IColumn[] = [
  {
    key: "button",
    name: "",
    fieldName: "",
    minWidth: 50,
    maxWidth: 50,
    isResizable: false,
  },
  {
    key: "name",
    name: "Name",
    fieldName: "name",
    minWidth: 300,
    maxWidth: 400,
    isResizable: true,
  },
  {
    key: "type",
    name: "Type",
    fieldName: "type",
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
  },
  {
    key: "size",
    name: "Size (kb)",
    fieldName: "size",
    minWidth: 50,
    maxWidth: 100,
    isResizable: true,
    data: "number",
  },
];

const Attachments: React.FC<{
  setFiles: (files: File[]) => void;
  setError: (hasError: boolean) => void;
  files: File[];
}> = ({ setFiles, setError, files }) => {
  const { t } = useTranslation();
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles]);
    },
    [files, setFiles]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".png,.jpg,.bsk,.pfb,.mp3",
  });
  const filesInfo = useMemo<{
    files: FileInfos[];
    imagesCount: number;
    imageSize: number;
    bskCount: number;
  }>(() => {
    const fi: FileInfos[] = files.map((f) => {
      let type;
      switch (f.type) {
        case "image/jpeg":
        case "image/png":
          type = "image";
          break;
        case "audio/mpeg3":
        case "audio/mp3":
        case "audio/mpeg":
          type = "sound";
          break;
        default:
          type = "bsk";
      }
      return {
        name: f.name,
        type: type as "audio" | "image" | "bsk",
        size: Math.round(f.size / 1024),
      };
    });
    const images = fi.filter(({ type }) => type === "image");
    return {
      files: fi,
      imagesCount: images.length,
      bskCount: fi.filter(({ type }) => type === "bsk").length,
      imageSize: images.reduce((prev, acc) => prev + acc.size, 0),
    };
  }, [files]);

  const error = useMemo<string | null>(() => {
    if (filesInfo.files.length === 0) {
      return null;
    }
    if (filesInfo.bskCount === 0) {
      return "Attachments.noBSK";
    }
    if (filesInfo.bskCount > 1) {
      return "Attachments.tooMuchBSKs";
    }
    if (filesInfo.imagesCount > 1) {
      return "Attachments.tooMuchImages";
    }
    if (filesInfo.imageSize > 1024) {
      return "Attachments.imageTooLarge";
    }
    if (filesInfo.files.reduce((prev, acc) => prev + acc.size, 0) > MAX_SIZE) {
      return "Attachments.quotaExceeded";
    }
    return null;
  }, [filesInfo]);

  useEffect(() => setError(error !== null), [error, setError]);

  const fileTotalSize = useMemo(
    () => files.reduce((prev, acc) => prev + acc.size / 1024, 0),
    [files]
  );

  const renderItemColumn = (item: any, index?: number, column?: IColumn) => {
    const fieldContent = item[column!.fieldName!] as string | number;

    switch (column?.key) {
      case "button":
        return (
          <IconButton
            iconProps={{ iconName: "delete" }}
            onClick={() => setFiles(files.filter((v, i) => i !== index))}
          />
        );
      default:
        return (
          <div style={{ height: 32, display: "flex", alignItems: "center" }}>
            {column?.key === "size" ? `${fieldContent} kb` : fieldContent}
          </div>
        );
    }
  };
  return (
    <div>
      <p>{t("Upload.attachmentsDescription")}</p>
      {/* eslint-disable-next-line */}
              <div {...getRootProps()} className={$.drop}>
        {/* eslint-disable-next-line */}
                  <input {...getInputProps()} />
        {isDragActive ? (
          <p>{t("Upload.dropInstruction")}</p>
        ) : (
          <p>{t("Upload.dragInstruction")}</p>
        )}
      </div>
      {filesInfo.files.length > 0 && (
        <DetailsList
          items={filesInfo.files}
          columns={columns}
          layoutMode={DetailsListLayoutMode.justified}
          disableSelectionZone
          selectionMode={0}
          onRenderItemColumn={renderItemColumn}
        />
      )}

      <ProgressIndicator
        label={t("Upload.quota")}
        percentComplete={fileTotalSize / MAX_SIZE}
        barHeight={10}
        styles={{ progressTrack: { background: "#343434" } }}
        description={
          files.length === 0
            ? t("Upload.noFiles")
            : `${Math.ceil(fileTotalSize / 1024)}mb / ${MAX_SIZE / 1024}mb`
        }
      />

      {error && <div className={$.error}>{t(error)}</div>}
    </div>
  );
};

export default Attachments;

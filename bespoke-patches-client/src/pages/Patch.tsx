import { gql, useMutation, useQuery } from "@apollo/client";
import { mergeStyleSets } from "@fluentui/merge-styles";
import {
  ActionButton,
  DefaultButton,
  IconButton,
  PrimaryButton,
  Stack,
} from "@fluentui/react";
import useUmami from "@parcellab/react-use-umami";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { useParams, useHistory } from "react-router-dom";
import BSKViz from "../components/BSKViz";
import DocumentTitle from "../components/DocumentTitle";
import Error from "../components/Error";
import Loader from "../components/Loader";
import PatchItem from "../components/PatchItem";
import ScriptsModal from "../components/ScriptsModal";
import SectionTitle from "../components/Typography";
import { Patch, PatchStatus } from "../hooks/patch.types";
import { MOBILE } from "../theme/constants";

const patchGQL = gql`
  query ($id: String!, $token: String) {
    patch(uuid: $id, token: $token) {
      uuid
      tags
      author
      summary
      title
      publicationDate
      coverImage
      revision
      audioSamples
      bskFile
      description
      content
      status
    }
  }
`;

const moderatePatchGQL = gql`
  mutation ($id: String!, $token: String!, $approved: Boolean!) {
    moderatePatch(uuid: $id, token: $token, approved: $approved)
  }
`;
const AudioItem: React.FC<{ src: string; fname: string }> = ({
  src,
  fname,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playpause = useCallback(() => {
    if (audioRef.current) {
      if (!isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);
  return (
    <Stack horizontal verticalAlign="center">
      <audio src={src} ref={audioRef} />
      <IconButton
        iconProps={{
          iconName: !isPlaying ? "play" : "pause",
        }}
        onClick={playpause}
      />
      <div>{fname.split("/").reverse()[0]}</div>
    </Stack>
  );
};

const $ = mergeStyleSets({
  back: {
    marginTop: 40,
    marginBottom: 20,
  },
  viz: {
    width: "70%",

    [MOBILE]: {
      width: "100%",
    },
  },
  samples: {
    paddingLeft: 12,

    [MOBILE]: {
      paddingLeft: 0,
    },
  },
  contentStack: {
    flexDirection: "row",

    [MOBILE]: {
      flexDirection: "column",
    },
  },
  approval: {
    display: "flex",
    marginTop: 40,
    justifyContent: "space-between",
    background: "#ff750099",
    alignItems: "center",
    padding: 10,
  },
});

const PatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  useUmami(`/patch/${id}`);
  const { t } = useTranslation();
  const [
    moderatePatch,
    { data: moderatePatchData, error: moderatePatchError },
  ] = useMutation(moderatePatchGQL);
  const h = useHistory();

  const token = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
  }, []);

  const { data, loading, error } = useQuery(patchGQL, {
    variables: { id, token },
  });

  const approve = useCallback(
    (approved: boolean) => {
      // eslint-disable-next-line no-restricted-globals
      if (!approved && !confirm("Are you sure")) {
        return;
      }
      moderatePatch({
        variables: {
          id,
          token,
          approved,
        },
      });
    },
    [id, moderatePatch, token]
  );

  useEffect(() => {
    if (moderatePatchError) {
      // eslint-disable-next-line no-console
      console.error(moderatePatchError);
      // eslint-disable-next-line no-alert
      alert("Patch approval failed");
    }
  });

  useEffect(() => {
    if (moderatePatchData) {
      if (moderatePatchData.moderatePatch === false) {
        h.push("/");
      } else {
        h.push(`/patch/${id}`);
        window.location.reload();
      }
    }
  }, [h, id, moderatePatchData]);

  const [showScriptModal, setShowScriptModal] = useState(false);

  const fullPatch = useMemo(() => {
    if (data?.patch) {
      return {
        ...data.patch,
        content: JSON.parse(data.patch.content),
      } as Patch;
    }
    return null;
  }, [data]);

  const scripts: { name: string; content: string }[] = useMemo(() => {
    if (fullPatch) {
      return fullPatch.content.modules
        ? fullPatch.content.modules
            .filter(({ script }) => script != null)
            .map((module) => ({ name: module.name, content: module.script! }))
        : [];
    }
    return [];
  }, [fullPatch]);

  const download = useCallback(() => {
    if (!fullPatch) {
      return;
    }
    const a = document.createElement("a");
    a.download = fullPatch.bskFile;
    a.href = `/files/${fullPatch.uuid}/${fullPatch.bskFile}`;
    a.click();
  }, [fullPatch]);

  if (error) {
    return <Error />;
  }

  if (!fullPatch || loading) {
    return <Loader full />;
  }

  return (
    <div>
      {showScriptModal && (
        <ScriptsModal
          scripts={scripts}
          onClose={() => {
            setShowScriptModal(false);
          }}
          onEnd={(valid: boolean) => {
            setShowScriptModal(false);

            if (valid) {
              download();
            }
          }}
        />
      )}
      <DefaultButton
        onClick={() => h.goBack()}
        iconProps={{ iconName: "back" }}
        className={$.back}
      >
        {t("Patch.back")}
      </DefaultButton>

      <PatchItem
        isList={false}
        patch={fullPatch}
        onDownload={() =>
          fullPatch && scripts.length > 0
            ? setShowScriptModal(true)
            : download()
        }
      />

      {fullPatch === undefined && <Loader full />}
      {fullPatch === null && <Error />}
      {fullPatch != null && (
        <div className="patch-content">
          <DocumentTitle>{fullPatch.title} / Bespoke Community</DocumentTitle>
          <Stack className={$.contentStack}>
            <div className={$.viz}>
              <SectionTitle>{t("Patch.viz")}</SectionTitle>
              {fullPatch.content?.modules && (
                <BSKViz modules={fullPatch.content.modules} />
              )}
            </div>
            <div className={$.samples}>
              <SectionTitle>{t("Patch.audio_samples")}</SectionTitle>
              {fullPatch.audioSamples.length === 0 && (
                <div>{t("Patch.no_audio_samples")}</div>
              )}
              {fullPatch.audioSamples.length > 0 &&
                fullPatch.audioSamples.map((as) => (
                  <AudioItem
                    src={`/files/${fullPatch.uuid}/${as}`}
                    key={as}
                    fname={as}
                  />
                ))}
              <ul>
                <li />
              </ul>
            </div>
          </Stack>

          <SectionTitle>{t("Patch.description")}</SectionTitle>
          {(fullPatch.description || "").trim().length === 0 ? (
            <div className="mdContent">{t("Patch.no_description")}</div>
          ) : (
            <div className="mdContent">
              <ReactMarkdown>{fullPatch.description || ""}</ReactMarkdown>
            </div>
          )}
        </div>
      )}

      {token && fullPatch.status === PatchStatus.WAITING_FOR_APPROVAL && (
        <div className={$.approval}>
          <div>Patch moderation</div>
          <div>
            <ActionButton onClick={() => approve(false)}>Delete</ActionButton>
            <PrimaryButton onClick={() => approve(true)}>Approve</PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatchPage;

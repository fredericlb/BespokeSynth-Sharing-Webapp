import { gql, useQuery } from "@apollo/client";
import { mergeStyleSets } from "@fluentui/merge-styles";
import { DefaultButton, IconButton, Stack } from "@fluentui/react";
import React, { useCallback, useMemo, useRef, useState } from "react";
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
import { Patch } from "../hooks/patch.types";
import { MOBILE } from "../theme/constants";

const patchGQL = gql`
  query ($id: String!) {
    patch(uuid: $id) {
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
      modules
    }
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
});

const PatchPage: React.FC = () => {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery(patchGQL, { variables: { id } });
  const [showScriptModal, setShowScriptModal] = useState(false);
  const h = useHistory();

  const fullPatch = useMemo(() => {
    if (data?.patch) {
      return {
        ...data.patch,
        modules: JSON.parse(data.patch.modules),
      } as Patch;
    }
    return null;
  }, [data]);

  const scripts: { name: string; content: string }[] = useMemo(() => {
    if (fullPatch) {
      return fullPatch.modules
        .filter(({ script }) => script != null)
        .map((module) => ({ name: module.name, content: module.script! }));
    }
    return [];
  }, [fullPatch]);

  const download = useCallback(() => {
    if (!fullPatch) {
      return;
    }
    const a = document.createElement("a");
    a.download = "download";
    a.href = fullPatch.bskFile;
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
              <BSKViz modules={fullPatch.modules} />
            </div>
            <div className={$.samples}>
              <SectionTitle>{t("Patch.audio_samples")}</SectionTitle>
              {fullPatch.audioSamples.length === 0 && (
                <div>{t("Patch.no_audio_samples")}</div>
              )}
              {fullPatch.audioSamples.length > 0 &&
                fullPatch.audioSamples.map((as) => (
                  <AudioItem src={as} key={as} fname={as} />
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
    </div>
  );
};

export default PatchPage;

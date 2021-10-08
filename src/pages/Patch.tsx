import { mergeStyleSets } from "@fluentui/merge-styles";
import { DefaultButton, IconButton, Stack } from "@fluentui/react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router-dom";
import BSKViz from "../components/BSKViz";
import DocumentTitle from "../components/DocumentTitle";
import Error from "../components/Error";
import Loader from "../components/Loader";
import PatchItem from "../components/PatchItem";
import ScriptsModal from "../components/ScriptsModal";
import SectionTitle from "../components/Typography";
import { Patch } from "../hooks/patch.types";
import { DataContext, IUseData } from "../hooks/useData";
import { MOBILE } from "../theme/constants";

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
  const { patches, getPatchInfo } = useContext(DataContext) as IUseData;
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [fullPatch, setFullPatch] = useState<Patch | null>();
  const h = useHistory();

  const scripts: { name: string; content: string }[] = useMemo(() => {
    if (fullPatch) {
      return fullPatch.bsk_content.modules
        .filter(({ script }) => script != null)
        .map((module) => ({ name: module.name, content: module.script! }));
    }
    return [];
  }, [fullPatch]);

  useEffect(() => {
    const f = async () => {
      setFullPatch(await getPatchInfo(id));
    };
    f();
  }, [getPatchInfo, id]);

  const download = useCallback(() => {
    if (!fullPatch) {
      return;
    }
    const a = document.createElement("a");
    a.download = "download";
    a.href = fullPatch.bsk_download;
    a.click();
  }, [fullPatch]);

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
        patch={patches[id]}
        onDownload={() =>
          fullPatch && fullPatch.scripts.length > 0
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
              <BSKViz modules={fullPatch.bsk_content.modules} />
            </div>
            <div className={$.samples}>
              <SectionTitle>{t("Patch.audio_samples")}</SectionTitle>
              {fullPatch.audio_samples.length === 0 && (
                <div>{t("Patch.no_audio_samples")}</div>
              )}
              {fullPatch.audio_samples.length > 0 &&
                fullPatch.audio_samples.map((as) => (
                  <AudioItem src={as} key={as} fname={as} />
                ))}
              <ul>
                <li />
              </ul>
            </div>
          </Stack>

          <SectionTitle>{t("Patch.description")}</SectionTitle>
          {fullPatch.html.trim().length === 0 ? (
            <div className="mdContent">{t("Patch.no_description")}</div>
          ) : (
            <div
              className="mdContent"
              dangerouslySetInnerHTML={{ __html: fullPatch.html }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PatchPage;

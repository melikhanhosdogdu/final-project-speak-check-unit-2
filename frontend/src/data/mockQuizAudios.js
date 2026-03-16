import AdvocateAudio from "../assets/audios/english/Advocate.mp3";
import AmbiguousAudio from "../assets/audios/english/Ambiguous.mp3";
import ArbitraryAudio from "../assets/audios/english/Arbitrary.mp3";
import ContemplateAudio from "../assets/audios/english/Contemplate.mp3";
import EndeavorAudio from "../assets/audios/english/Endeavor.mp3";
import MeticulousAudio from "../assets/audios/english/Meticulous.mp3";
import ProfoundAudio from "../assets/audios/english/Profound.mp3";
import ResilientAudio from "../assets/audios/english/Resilient.mp3";
import SereneAudio from "../assets/audios/english/Serene.mp3";
import TrivialAudio from "../assets/audios/english/Trivial.mp3";
import PapillonAudio from "../assets/audios/french/Papillon.mp3";
import EsperanzaAudio from "../assets/audios/spanish/Esperanza.mp3";
import MariposaAudio from "../assets/audios/spanish/Mariposa.mp3";
import SuenoAudio from "../assets/audios/spanish/Sueño.mp3";

export const quizAudios = {
  English: [
    { keyword: "Advocate", audioUrl: AdvocateAudio },
    { keyword: "Ambiguous", audioUrl: AmbiguousAudio },
    { keyword: "Arbitrary", audioUrl: ArbitraryAudio },
    { keyword: "Contemplate", audioUrl: ContemplateAudio },
    { keyword: "Endeavor", audioUrl: EndeavorAudio },
    { keyword: "Meticulous", audioUrl: MeticulousAudio },
    { keyword: "Profound", audioUrl: ProfoundAudio },
    { keyword: "Resilient", audioUrl: ResilientAudio },
    { keyword: "Serene", audioUrl: SereneAudio },
    { keyword: "Trivial", audioUrl: TrivialAudio },
  ],
  French: [{ keyword: "Papillon", audioUrl: PapillonAudio }],
  Spanish: [
    { keyword: "Esperanza", audioUrl: EsperanzaAudio },
    { keyword: "Mariposa", audioUrl: MariposaAudio },
    { keyword: "Sueño", audioUrl: SuenoAudio },
  ],
  German: [],
};

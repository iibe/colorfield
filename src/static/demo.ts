import dat from "dat.gui";
import Colorfield from "~/colorfield";

const gui = new dat.GUI();

gui.closed = true;

const col1 = new Colorfield("#canvas-1");
const dir1 = gui.addFolder("#canvas-1");
dir1.add(col1.config, "step", 0, 10, 1);
dir1.add(col1.config, "base", 0, 2000, 50);
dir1.add(col1.config, "zOffsetStep", 0, 0.01, 0.00025);
dir1.open();

const col2 = new Colorfield("#canvas-2", {
  colorMode: "grayscale",
  frameRange: [750, 2000],
});
const dir2 = gui.addFolder("#canvas-2");
dir2.add(col2.config, "step", 0, 10, 1);
dir2.add(col2.config, "base", 0, 2000, 50);
dir2.add(col2.config, "zOffsetStep", 0, 0.01, 0.00025);
dir2.open();

const col3 = new Colorfield("#canvas-3", { colorIntensityMix: 0.25 });
const dir3 = gui.addFolder("#canvas-3");
dir3.add(col3.config, "step", 0, 10, 1);
dir3.add(col3.config, "base", 0, 2000, 50);
dir3.add(col3.config, "zOffsetStep", 0, 0.01, 0.00025);
dir3.open();

const col4 = new Colorfield("#canvas-4", {
  colorLightnessMix: 0.25,
  zOffsetStep: 0.01,
});
const dir4 = gui.addFolder("#canvas-4");
dir4.add(col4.config, "step", 0, 10, 1);
dir4.add(col4.config, "base", 0, 2000, 50);
dir4.add(col4.config, "zOffsetStep", 0, 0.01, 0.00025);
dir4.open();

const col5 = new Colorfield("#canvas-5", {
  colorOpacityMix: 0.25,
  frameRange: [500, 1000],
});
const dir5 = gui.addFolder("#canvas-5");
dir5.add(col5.config, "step", 0, 10, 1);
dir5.add(col5.config, "base", 0, 2000, 50);
dir5.add(col5.config, "zOffsetStep", 0, 0.01, 0.00025);
dir5.open();

const col6 = new Colorfield("#canvas-6", {
  colorIntensityMix: 0.5,
  colorLightnessMix: 0.5,
  frameRange: [300, 600],
});
const dir6 = gui.addFolder("#canvas-6");
dir6.add(col6.config, "step", 0, 10, 1);
dir6.add(col6.config, "base", 0, 2000, 50);
dir6.add(col6.config, "zOffsetStep", 0, 0.01, 0.00025);
dir6.open();

const col7 = new Colorfield("#canvas-7", {
  colorLightnessMix: 0.8,
  colorOpacityMix: 0.2,
  frameRange: [750, 2000],
});
const dir7 = gui.addFolder("#canvas-7");
dir7.add(col7.config, "step", 0, 10, 1);
dir7.add(col7.config, "base", 0, 2000, 50);
dir7.add(col7.config, "zOffsetStep", 0, 0.01, 0.00025);
dir7.open();

const col8 = new Colorfield("#canvas-8", {
  frameRange: [750, 2000],
});
const dir8 = gui.addFolder("#canvas-8");
dir8.add(col8.config, "step", 0, 10, 1);
dir8.add(col8.config, "base", 0, 2000, 50);
dir8.add(col8.config, "zOffsetStep", 0, 0.01, 0.00025);
dir8.open();

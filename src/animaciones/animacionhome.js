export default () => {
  const section = document.querySelector("section");
  const slider = document.querySelector("ul");
  const btnNewAvenger = document.querySelector("#newAvenger");
  const windowCreate = document.querySelector(".windowCreate");
  const widthSlider = slider.getBoundingClientRect().width - 180 + 1100;
  let isDown = false;
  let isMove = 0;
  let startX;
  let scrollLeft;

  document.addEventListener(
    "click",
    (e) => {
      if (
        e.target.localName === "div" ||
        e.target.localName === "input" ||
        e.target.localName === "textarea" ||
        e.target.localName === "form" ||
        e.target.localName === "p" ||
        e.target.localName === "label" ||
        e.target.localName === "a" ||
        e.target.localName === "h2"
      ) {
        return;
      }

      if (e.target.localName === "img" && isMove < 2) {
        [...slider.children].map((e) => {
          e.classList.remove("active");
          e.classList.add("back");
        });

        let li = e.target.parentNode;
        li.classList.remove("back");
        li.classList.add("active");

        const select = [...slider.children].indexOf(e.target.parentNode);
        const out = Math.floor(widthSlider / 320) * 320 - widthSlider;
        const aux = widthSlider - (select + 1) * 320;
        section.style.left = `-${
          aux <= Math.abs(out)
            ? Math.abs(aux) + (aux >= 0 ? out : Math.abs(out)) + 180 - 1100
            : 0
        }px`;
        slider.scrollLeft = select * 320;

        return;
      }

      if (e.target.localName === "button" && isMove < 2) {
        let li = e.target.parentNode;
        li.classList.toggle("more");

        return;
      }

      [...slider.children].map((e) => {
        e.classList.remove("active");
        e.classList.remove("back");
        e.classList.remove("more");
        section.style.left = 0;
      });
    },
    false
  );

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    isMove = 0;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    isMove++;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1;
    slider.scrollLeft = scrollLeft - walk;
  });

  btnNewAvenger.addEventListener("click", () => {
    windowCreate.classList.add("active");
  });

  windowCreate.addEventListener("click", (e) => {
    console.log(e.target.classList[0]);
    if (e.target.classList[0] == "windowCreate") {
      windowCreate.classList.remove("active");
    }
  });
};

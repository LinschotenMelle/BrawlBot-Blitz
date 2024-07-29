import { createCanvas, loadImage, registerFont } from "canvas";
import { RegisteredTeam } from "./CreateNewTournament";

function calculateTotalColumns(teamsLength: number, initialTeams: number) {
  let totalColumns = initialTeams;
  while (totalColumns < teamsLength) {
    totalColumns *= 2;
  }
  return totalColumns;
}

function shuffleArray(array: RegisteredTeam[]): RegisteredTeam[] {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

export async function createBracket(
  title: string,
  teams: RegisteredTeam[],
  creator: string,
  time: string
): Promise<Buffer> {
  registerFont(require("@canvas-fonts/helveticaneue"), {
    family: "HelveticaNeue",
  });
  const initialTeams = 2;
  const totalColumns = calculateTotalColumns(teams.length, initialTeams);
  const totalRounds = Math.log2(totalColumns) + 1;

  const canvas = createCanvas(0, 0);
  const ctx = canvas.getContext("2d");

  const shuffledArray = shuffleArray(teams);
  const longestName = teams.sort(
    (a, b) => b.teamName.length - a.teamName.length
  )[0].teamName;

  // Draw the rectangles
  const rectWidth =
    longestName.length * 10 <= 180 ? 180 : longestName.length * 10;
  const rectHeight = 30;
  const spacing = 20;
  const lineWidth = 1;
  const bottomBarHeight = 30;

  const totalWidth = (rectWidth + spacing) * totalRounds * 1.5;
  canvas.width = totalWidth;
  canvas.height =
    totalColumns * (rectHeight + spacing) -
    spacing +
    (bottomBarHeight + spacing);

  ctx.fillStyle = "#f3f4f5";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stroked triangle
  ctx.fillStyle = "#fff";
  const triangleWidth =
    totalRounds - 2 == 0
      ? canvas.height / totalRounds
      : canvas.height / (totalRounds - 2);
  ctx.beginPath();
  ctx.moveTo(canvas.width, canvas.height - bottomBarHeight);
  ctx.lineTo(canvas.width - triangleWidth, canvas.height - bottomBarHeight);
  ctx.lineTo(canvas.width, canvas.height - bottomBarHeight - triangleWidth);
  ctx.closePath();
  ctx.fill();

  var fontSize = 30;
  if (teams.length <= 2) {
    fontSize = 20;
  }
  ctx.fillStyle = "#000";
  ctx.font = `${fontSize}px "HelveticaNeue"`;
  ctx.fillText(
    title,
    totalWidth - title.length * (fontSize / 2),
    fontSize,
    totalWidth
  );
  ctx.fillStyle = "#008E4F";
  ctx.fillRect(totalWidth - 6, 4, totalWidth, fontSize);

  for (var i = 0; i < totalColumns; i++) {
    ctx.fillStyle = "#D8D9D9";
    ctx.fillRect(0, i * (rectHeight + spacing), rectWidth, rectHeight);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, i * (rectHeight + spacing), 6, rectHeight);

    // Lines
    ctx.fillRect(
      rectWidth,
      i * (rectHeight + spacing) + rectHeight / 2,
      spacing * lineWidth,
      lineWidth
    );
    if (i % 2 == 0) {
      ctx.fillRect(
        rectWidth + spacing * lineWidth,
        i * (rectHeight + spacing) + rectHeight / 2,
        lineWidth,
        (rectHeight + spacing) / 2
      );
    } else {
      ctx.fillRect(
        rectWidth + spacing * lineWidth,
        i * (rectHeight + spacing) + rectHeight / 2 + lineWidth,
        lineWidth,
        -(rectHeight + spacing) / 2
      );
    }
  }

  ctx.font = `14px "HelveticaNeue"`;
  for (var i = 0; i < shuffledArray.length; i++) {
    ctx.fillText(
      shuffledArray[i].teamName,
      10,
      20 + i * (rectHeight + spacing),
      rectWidth
    );
  }

  var totalPerRound = totalColumns / 2;
  var y = 2;
  var y2 = 0;
  for (var i = 0; i < totalRounds - 1; i++) {
    for (var j = 0; j < totalPerRound; j++) {
      // Line
      ctx.fillStyle = "#000";
      ctx.fillRect(
        (1.5 * i + 1.5) * (rectWidth + spacing) - spacing * 5,
        (y * j + (y2 + 0.5)) * (rectHeight + spacing) + rectHeight / 2,
        spacing * 5,
        lineWidth
      );
      if (1 != totalPerRound) {
        ctx.fillRect(
          (1.5 * i + 1.5) * (rectWidth + spacing) + rectWidth,
          (y * j + (y2 + 0.5)) * (rectHeight + spacing) + rectHeight / 2,
          spacing * lineWidth,
          lineWidth
        );
        if (j % 2 == 0) {
          ctx.fillRect(
            (1.5 * i + 1.5) * (rectWidth + spacing) +
              rectWidth +
              spacing * lineWidth,
            (y * j + (y2 + 0.5)) * (rectHeight + spacing) + rectHeight / 2,
            lineWidth,
            (rectHeight + spacing) * (y2 + 1)
          );
        } else {
          ctx.fillRect(
            (1.5 * i + 1.5) * (rectWidth + spacing) +
              rectWidth +
              spacing * lineWidth,
            (y * j + (y2 + 0.5)) * (rectHeight + spacing) +
              rectHeight / 2 +
              lineWidth,
            lineWidth,
            -(rectHeight + spacing) * (y2 + 1)
          );
        }
      }
      // Rectangle
      ctx.fillStyle = "#D8D9D9";
      ctx.fillRect(
        (1.5 * i + 1.5) * (rectWidth + spacing),
        (y * j + (y2 + 0.5)) * (rectHeight + spacing),
        rectWidth,
        rectHeight
      );
      if (i % 2 == 0) {
        ctx.fillStyle = "#008E4F";
      } else {
        ctx.fillStyle = "#000";
      }
      ctx.fillRect(
        (1.5 * i + 1.5) * (rectWidth + spacing),
        (y * j + (y2 + 0.5)) * (rectHeight + spacing),
        6,
        rectHeight
      );
    }
    totalPerRound /= 2;
    y *= 2;
    if (y2 == 0) {
      y2 = 1;
    } else {
      y2 = y2 + y2 + 1;
    }
  }

  const trophyImage = await loadImage(
    "https://images.emojiterra.com/google/noto-emoji/unicode-15.1/bw/128px/1f3c6.png"
  );

  var size = trophyImage.width;

  if (totalColumns <= 4) {
    size = 60;
  }
  if (totalColumns <= 2) {
    size = 30;
  }

  var math = totalRounds;
  if (totalColumns == 8) {
    math = 5;
  }

  ctx.drawImage(
    trophyImage,
    (totalWidth / totalRounds) * (totalRounds - 1) + (rectWidth - size) / 2,
    (totalColumns / 2 - 1) * (rectHeight + spacing) +
      (rectHeight - size) +
      rectHeight * math,
    size,
    size
  );

  // Bottom bar
  ctx.fillStyle = "#000";
  ctx.fillRect(
    0,
    canvas.height - bottomBarHeight,
    canvas.width,
    bottomBarHeight
  );
  ctx.fillStyle = "#008E4F";
  ctx.fillRect(
    canvas.width - triangleWidth,
    canvas.height - bottomBarHeight,
    triangleWidth,
    bottomBarHeight
  );
  ctx.beginPath();
  ctx.moveTo(canvas.width - triangleWidth + 1, canvas.height);
  ctx.lineTo(canvas.width - triangleWidth + 1, canvas.height - bottomBarHeight);
  ctx.lineTo(canvas.width - triangleWidth - 30, canvas.height);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.fillText(
    `Made by: ${creator} - Created at: ${time}`,
    4,
    canvas.height - 10,
    canvas.width
  );

  return canvas.toBuffer();
}

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", async function () {
	const header = document.querySelector(".header");
	const canvas = document.getElementById("frameCanvas");
	const ctx = canvas.getContext("2d");
	function initCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		const pixelRatio = window.devicePixelRatio || 1;
		ctx.scale(pixelRatio, pixelRatio);
		// 初始化时首先加载一张防止长时间白屏
		let img = new Image();
		img.src = `/adalin2/public/16x9_281/standard/graded_4K_100_gm_50_1080_3-002.jpg`;
		img.onload = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			loadImgs();
		};
	}
	initCanvas();

	let images = []; //canvas绘制使用的图片序列
    // 加载其他图片
	function loadImgs() {
		const imagesCounts = 281;
		for (let i = 2; i <= imagesCounts; i++) {
			let img = new Image();
			img.src = `/adalin2/public/16x9_281/standard/graded_4K_100_gm_50_1080_3-${i
				.toString()
				.padStart(3, "0")}.jpg`;
			img.onload = () => {
				images.push(img);
				if (images.length === imagesCounts - 1) {
					// 等待所有图片加载完成
					enableScrollTrigger();
				}
			};
		}
	}

	function enableScrollTrigger() {
		ScrollTrigger.create({
			trigger: "#frameCanvas",
			start: "top top",
			end: "bottom top",
			scrub: true,
			pin: "#frameCanvas",
			onUpdate: (self) => {
				const frameIndex = Math.floor(
					self.progress * (images.length - 1)
				);
				if (
					images[frameIndex].complete &&
					images[frameIndex].naturalHeight !== 0
				) {
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(
						images[frameIndex],
						0,
						0,
						canvas.width,
						canvas.height
					);
				}

				// header动画
				if (self.progress <= 0.25) {
					const zProgress = self.progress / 0.25;
					const translateZ = zProgress * -500;
					let opacity = 1;
					if (self.progress >= 0.2) {
						const fadeProgress = Math.min(
							(self.progress - 0.2) / (0.25 - 0.2),
							1
						);
						opacity = 1 - fadeProgress;
					}

					gsap.set(header, {
						transform: `translate(-50%, -50%) translateZ(${translateZ}px)`,
						opacity,
					});
				} else {
					gsap.set(header, { opacity: 0 });
				}
			},
		});
	}
	// 监听window.resize
	window.addEventListener("resize", initCanvas());
});

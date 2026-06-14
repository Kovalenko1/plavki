import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowDown,
  BadgeCheck,
  Check,
  ChevronRight,
  Minus,
  Orbit,
  Plus,
  Radar,
  Rocket,
  Sparkles,
  Waves,
  Zap,
} from 'lucide-react';
import productImage from './assets/product.png';
import lifestyleImage from './assets/lifestyle.png';

gsap.registerPlugin(ScrollTrigger);

const sizes = ['S', 'M', 'L', 'XL'];
const colors = [
  { id: 'noir', label: 'Noir', hex: '#050506' },
  { id: 'olive', label: 'Olive', hex: '#747029' },
  { id: 'brass', label: 'Brass', hex: '#c6a34a' },
];

const details = [
  {
    icon: BadgeCheck,
    title: 'Поддержка без драмкружка',
    text: 'Держит посадку так уверенно, будто Оскар подписал договор с гравитацией и попросил скидку.',
  },
  {
    icon: Sparkles,
    title: 'Латунь, потому что пластик не прошел кастинг',
    text: 'Фурнитура блестит аккуратно: не “я золотой батон”, а “да, я тут главный аргумент”.',
  },
  {
    icon: Waves,
    title: 'Матовая ткань против суеты',
    text: 'Не бликует, не кричит, не спрашивает “как дела”. Просто делает Оскара подозрительно собранным.',
  },
];

const timeline = [
  ['01', 'Вход в легенду', 'Оставляете контакт, размер и моральную готовность выглядеть как человек из трейлера.'],
  ['02', 'Оскарская проверка', 'Сверяем параметры партии, чтобы ремни держали стиль, а не ваши сомнения.'],
  ['03', 'Доставка артефакта', 'Когда партия готова, присылаем оплату и путь к плавкам, которые уже все обсудили.'],
];

const promoLines = [
  'Оскар вышел к реке - река открыла предзаказ',
  '3D-посадка, 0D скуки',
  'Латунь блестит, кринж молчит',
  'Плавки для тех, кто пришел не просто намокнуть',
];

function ThreeScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let disposed = false;
    let cleanupScene = () => {};

    const setupScene = async () => {
      const THREE = await import('three');
      if (disposed || !mountRef.current) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0.25, 7.4);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const disposables = [];
      const group = new THREE.Group();
      const tunnel = new THREE.Group();
      const hardwareCloud = new THREE.Group();
      scene.add(group, tunnel, hardwareCloud);

      const gold = new THREE.MeshStandardMaterial({
        color: 0xc6a34a,
        roughness: 0.24,
        metalness: 0.9,
        emissive: 0x241700,
        emissiveIntensity: 0.22,
      });
      const smoke = new THREE.MeshStandardMaterial({
        color: 0x111414,
        roughness: 0.55,
        metalness: 0.36,
        transparent: true,
        opacity: 0.7,
      });
      const glass = new THREE.MeshStandardMaterial({
        color: 0x233326,
        roughness: 0.18,
        metalness: 0.1,
        transparent: true,
        opacity: 0.22,
      });
      disposables.push(gold, smoke, glass);

      const knotGeometry = new THREE.TorusKnotGeometry(1.32, 0.024, 240, 12, 3, 5);
      const knot = new THREE.Mesh(knotGeometry, gold);
      knot.position.set(2.45, -0.25, -1.6);
      knot.rotation.set(0.65, 0.25, -0.1);
      group.add(knot);
      disposables.push(knotGeometry);

      const haloGeometry = new THREE.TorusGeometry(2.55, 0.012, 16, 260);
      const haloA = new THREE.Mesh(haloGeometry, smoke);
      haloA.rotation.set(1.2, 0.16, 0.2);
      group.add(haloA);
      disposables.push(haloGeometry);

      const haloGoldGeometry = new THREE.TorusGeometry(1.62, 0.018, 16, 240);
      const haloB = new THREE.Mesh(haloGoldGeometry, gold);
      haloB.position.set(-2.1, 0.78, -1.2);
      haloB.rotation.set(1.1, -0.5, -0.4);
      group.add(haloB);
      disposables.push(haloGoldGeometry);

      const tunnelGeometry = new THREE.TorusGeometry(1.2, 0.006, 10, 120);
      const tunnelRings = Array.from({ length: 14 }, (_, index) => {
        const ring = new THREE.Mesh(tunnelGeometry, index % 3 === 0 ? gold : glass);
        const scale = 1.1 + index * 0.22;
        ring.scale.set(scale, scale, scale);
        ring.position.set(0.4 - index * 0.08, 0.05 + Math.sin(index) * 0.08, -index * 0.42);
        ring.rotation.set(1.24, index * 0.22, index * 0.19);
        tunnel.add(ring);
        return ring;
      });
      tunnel.position.set(1.1, -0.15, -1.8);
      disposables.push(tunnelGeometry);

      const satelliteGeometry = new THREE.BoxGeometry(0.12, 0.05, 0.05);
      const satelliteCoreGeometry = new THREE.SphereGeometry(0.055, 18, 18);
      const satellites = Array.from({ length: 18 }, (_, index) => {
        const pivot = new THREE.Group();
        const body = new THREE.Mesh(index % 2 === 0 ? satelliteGeometry : satelliteCoreGeometry, gold);
        const radius = 1.25 + (index % 6) * 0.18;
        body.position.set(radius, Math.sin(index * 1.7) * 0.22, 0);
        body.rotation.set(index * 0.7, index * 0.3, index * 0.5);
        pivot.rotation.set(index * 0.21, index * 0.34, index * 0.62);
        pivot.add(body);
        hardwareCloud.add(pivot);
        return pivot;
      });
      hardwareCloud.position.set(1.65, 0.25, -0.9);
      disposables.push(satelliteGeometry, satelliteCoreGeometry);

      const particles = new THREE.BufferGeometry();
      const particleCount = 620;
      const positions = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      for (let index = 0; index < particleCount; index += 1) {
        positions[index * 3] = (Math.random() - 0.5) * 10;
        positions[index * 3 + 1] = (Math.random() - 0.5) * 6.4;
        positions[index * 3 + 2] = (Math.random() - 0.5) * 6 - 1.2;
        sizes[index] = Math.random();
      }
      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particles.setAttribute('sizeSeed', new THREE.BufferAttribute(sizes, 1));
      const pointMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: 0xd8bf67,
        transparent: true,
        opacity: 0.74,
        depthWrite: false,
      });
      const points = new THREE.Points(particles, pointMaterial);
      scene.add(points);
      disposables.push(particles, pointMaterial);

      const lightA = new THREE.PointLight(0xf5d66a, 5.4, 12);
      lightA.position.set(2.5, 2.7, 3.5);
      scene.add(lightA);
      const lightB = new THREE.PointLight(0xffffff, 2.4, 10);
      lightB.position.set(-3.2, -1.8, 4);
      scene.add(lightB);
      const lightC = new THREE.PointLight(0x9fcf9a, 1.8, 9);
      lightC.position.set(0.6, -2.2, 3.1);
      scene.add(lightC);
      scene.add(new THREE.AmbientLight(0x9aa08f, 1.05));

      const resize = () => {
        const { clientWidth, clientHeight } = mount;
        renderer.setSize(clientWidth, clientHeight);
        camera.aspect = clientWidth / Math.max(clientHeight, 1);
        camera.updateProjectionMatrix();
      };

      let pointerX = 0;
      let pointerY = 0;
      const onPointerMove = (event) => {
        pointerX = (event.clientX / window.innerWidth - 0.5) * 0.9;
        pointerY = (event.clientY / window.innerHeight - 0.5) * 0.62;
      };

      window.addEventListener('resize', resize);
      window.addEventListener('pointermove', onPointerMove);
      resize();

      let raf = 0;
      const clock = new THREE.Clock();
      const render = () => {
        const elapsed = clock.getElapsedTime();
        const scrollMax = document.documentElement.scrollHeight - window.innerHeight || 1;
        const scrollProgress = Math.min(window.scrollY / scrollMax, 1);

        if (!prefersReducedMotion) {
          group.rotation.y = elapsed * 0.12 + pointerX + scrollProgress * 1.1;
          group.rotation.x = -pointerY + scrollProgress * 0.28;
          knot.rotation.z = elapsed * 0.26;
          haloA.rotation.z = elapsed * 0.08 + scrollProgress * 2.2;
          haloB.rotation.x = 1.1 + Math.sin(elapsed * 0.7) * 0.16;
          tunnel.rotation.z = elapsed * 0.08 + scrollProgress * 3.5;
          tunnel.position.z = -1.8 + scrollProgress * 1.4;
          hardwareCloud.rotation.y = -elapsed * 0.38 + pointerX * 0.7;
          hardwareCloud.rotation.x = elapsed * 0.12 - pointerY * 0.4;
          satellites.forEach((satellite, index) => {
            satellite.rotation.z += 0.008 + index * 0.0009;
            satellite.rotation.y += 0.004;
          });
          tunnelRings.forEach((ring, index) => {
            ring.rotation.z += 0.002 + index * 0.0007;
            ring.scale.x = ring.scale.y = ring.scale.z =
              1.1 + index * 0.22 + Math.sin(elapsed * 1.4 + index) * 0.025;
          });
          points.rotation.y = elapsed * 0.04 + scrollProgress * 0.9;
          points.rotation.x = Math.sin(elapsed * 0.22) * 0.08;
        }
        renderer.render(scene, camera);
        raf = requestAnimationFrame(render);
      };
      render();

      cleanupScene = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', onPointerMove);
        disposables.forEach((item) => item.dispose?.());
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement);
        }
      };
    };

    setupScene();

    return () => {
      disposed = true;
      cleanupScene();
    };
  }, []);

  return <div className="three-scene" ref={mountRef} aria-hidden="true" />;
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Support Swim">
        <span>OSCAR</span>
        <span>SWIM</span>
      </a>
      <nav aria-label="Основная навигация">
        <a href="#engineering">Механика</a>
        <a href="#movement">Оскар</a>
        <a href="#preorder">Предзаказ</a>
      </nav>
      <a className="header-cta" href="#preorder">
        В список Оскара
        <ChevronRight aria-hidden="true" size={16} />
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero section" id="top">
      <ThreeScene />
      <div className="warp-band" aria-hidden="true" />
      <div className="hero-copy reveal">
        <h1>Оскар в плавках — бобры сидят в палатках</h1>
        <p>
          Это не просто плавки, это маленький отдел техподдержки для харизмы.
          Оскар надел, река задумалась, трава попросила ссылку на предзаказ.
        </p>
        <div className="hero-actions">
          <a className="primary-button magnetic" href="#preorder">
            Хочу как у Оскара
            <ChevronRight aria-hidden="true" size={18} />
          </a>
          <a className="text-link" href="#engineering">
            Запустить механику
            <ArrowDown aria-hidden="true" size={16} />
          </a>
        </div>
      </div>

      <div className="product-stage reveal" data-tilt>
        <div className="stage-ring ring-one" />
        <div className="stage-ring ring-two" />
        <div className="stage-ring ring-three" />
        <span className="stage-satellite sat-one" />
        <span className="stage-satellite sat-two" />
        <span className="stage-satellite sat-three" />
        <img src={productImage} alt="Черные плавки с поддерживающими ремнями" />
        <div className="spec-chip chip-left">Оскар-режим</div>
        <div className="spec-chip chip-right">Блеск без кринжа</div>
        <div className="stage-badge badge-one">+300 к выходу из воды</div>
        <div className="stage-badge badge-two">анти-скука включена</div>
      </div>
    </section>
  );
}

function Marquee3D() {
  return (
    <div className="dimension-ticker" aria-hidden="true">
      <div className="ticker-track">
        {[...promoLines, ...promoLines].map((line, index) => (
          <span key={`${line}-${index}`}>{line}</span>
        ))}
      </div>
    </div>
  );
}

function DetailCard({ item, index }) {
  const Icon = item.icon;
  return (
    <article className="detail-card reveal" data-tilt style={{ '--delay': `${index * 0.08}s` }}>
      <span className="detail-index">0{index + 1}</span>
      <Icon aria-hidden="true" size={24} />
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </article>
  );
}

function Engineering() {
  return (
    <section className="section engineering" id="engineering">
      <div className="section-heading reveal">
        <span>OSCAR LAB</span>
        <h2>Конструкция, чтобы Оскар шел, а кадр держался</h2>
      </div>
      <div className="detail-grid">
        {details.map((item, index) => (
          <DetailCard key={item.title} item={item} index={index} />
        ))}
      </div>
      <div className="construction reveal" data-tilt>
        <div className="construction-copy">
          <h3>Если Оскар прислонился к арт-объекту, арт-объект стал аксессуаром</h3>
          <p>
            Ремни работают как архитектура: держат линию, дают свободу движению и
            добавляют тот самый “почему это выглядит настолько уверенно?”.
          </p>
        </div>
        <div className="motion-stack" aria-hidden="true">
          <div className="motion-panel panel-top">
            <Orbit size={26} />
            <span>orbit fit</span>
          </div>
          <div className="motion-panel panel-mid">
            <Radar size={26} />
            <span>oscar scan</span>
          </div>
          <div className="motion-panel panel-bottom">
            <Zap size={26} />
            <span>no cringe</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Movement() {
  return (
    <section className="section movement" id="movement">
      <div className="lifestyle-frame reveal" data-tilt>
        <img src={lifestyleImage} alt="Оскар в плавках у реки и холмов" />
        <div className="photo-caption">
          <Rocket size={18} />
          Оскар вышел на природу, природа сделала вид, что так и планировала
        </div>
      </div>
      <div className="movement-copy reveal">
        <h2>Оскар вышел к реке — и стал легендой в ТГК</h2>
        <p>
          Тут нет “просто фото на лугу”. Тут человек, плавки, странный арт-объект
          и ощущение, что сейчас начнется трейлер к лету.
        </p>
        <blockquote className="oscar-quote">
          “Я ничего не продаю. Я просто стою, а предзаказ уже оформляется.”
        </blockquote>
        <div className="motion-line">
          <span />
          <strong>скульптурный вайб без лишней суеты</strong>
          <span />
        </div>
      </div>
    </section>
  );
}

function Preorder() {
  const [size, setSize] = useState('M');
  const [color, setColor] = useState(colors[0].id);
  const [quantity, setQuantity] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '' });

  const selectedColor = colors.find((item) => item.id === color);
  const total = useMemo(() => quantity * 12900, [quantity]);

  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="section preorder" id="preorder">
      <div className="preorder-copy reveal">
        <h2>Забронировать себе оскаровский вайб</h2>
        <p>
          Оплаты на сайте нет, только заявка. Сначала фиксируем размер, потом
          гардероб спокойно принимает факт, что обычные плавки уже проиграли.
        </p>
        <div className="drop-list">
          {timeline.map(([number, title, text]) => (
            <div className="drop-step" key={number} data-tilt>
              <span>{number}</span>
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form className="order-panel reveal" data-tilt onSubmit={submit}>
        <div className="order-preview">
          <img src={productImage} alt="" aria-hidden="true" />
          <div>
            <span>OSCAR SWIM DROP</span>
            <strong>{new Intl.NumberFormat('ru-RU').format(total)} ₽</strong>
          </div>
        </div>

        <label className="field">
          <span>Позывной</span>
          <input
            required
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Например: друг Оскара"
          />
        </label>

        <label className="field">
          <span>Телефон или Telegram</span>
          <input
            required
            value={form.contact}
            onChange={(event) => setForm((current) => ({ ...current, contact: event.target.value }))}
            placeholder="+7 или @oscar_core"
          />
        </label>

        <div className="control-group">
          <span className="control-label">Размер брони</span>
          <div className="segmented">
            {sizes.map((item) => (
              <button
                type="button"
                key={item}
                className={size === item ? 'active' : ''}
                onClick={() => setSize(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <span className="control-label">Уровень блеска</span>
          <div className="swatches">
            {colors.map((item) => (
              <button
                type="button"
                key={item.id}
                className={color === item.id ? 'active' : ''}
                onClick={() => setColor(item.id)}
                aria-label={item.label}
              >
                <span style={{ background: item.hex }} />
              </button>
            ))}
          </div>
        </div>

        <div className="quantity-row">
          <span>Сколько легенд пакуем</span>
          <div className="stepper">
            <button
              type="button"
              aria-label="Уменьшить количество"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            >
              <Minus aria-hidden="true" size={16} />
            </button>
            <strong>{quantity}</strong>
            <button
              type="button"
              aria-label="Увеличить количество"
              onClick={() => setQuantity((value) => Math.min(5, value + 1))}
            >
              <Plus aria-hidden="true" size={16} />
            </button>
          </div>
        </div>

        <div className="summary">
          <span>
            {quantity} шт. / размер {size} / {selectedColor.label}
          </span>
          <strong>{new Intl.NumberFormat('ru-RU').format(total)} ₽</strong>
        </div>

        <button className="primary-button submit-button" type="submit">
          {submitted ? (
            <>
              <Check aria-hidden="true" size={18} />
              Оскар записал вас в список
            </>
          ) : (
            <>
              Хочу плавки как у Оскара
              <ChevronRight aria-hidden="true" size={18} />
            </>
          )}
        </button>
      </form>
    </section>
  );
}

function App() {
  useEffect(() => {
    const tiltCleanups = [];
    const context = gsap.context(() => {
      gsap.to('.scroll-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 0,
          end: 'max',
          scrub: 0.2,
        },
      });

      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 54, rotateX: -10, scale: 0.98 },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 1.05,
            ease: 'power3.out',
            delay: Number(element.style.getPropertyValue('--delay').replace('s', '')) || 0,
            scrollTrigger: {
              trigger: element,
              start: 'top 84%',
            },
          },
        );
      });

      gsap.to('.product-stage', {
        rotateY: -7,
        rotateX: 4,
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          scrub: true,
          start: 'top top',
          end: 'bottom top',
        },
      });

      gsap.to('.product-stage img', {
        yPercent: -9,
        rotateZ: 3.6,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          scrub: true,
          start: 'top top',
          end: 'bottom top',
        },
      });

      gsap.to('.warp-band', {
        rotateZ: 12,
        scale: 1.22,
        opacity: 0.72,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          scrub: true,
          start: 'top top',
          end: 'bottom top',
        },
      });

      gsap.to('.ticker-track', {
        xPercent: -32,
        ease: 'none',
        scrollTrigger: {
          trigger: '.dimension-ticker',
          scrub: true,
          start: 'top bottom',
          end: 'bottom top',
        },
      });

      gsap.to('.lifestyle-frame img', {
        scale: 1.16,
        yPercent: -10,
        rotateZ: -1.4,
        ease: 'none',
        scrollTrigger: {
          trigger: '.movement',
          scrub: true,
          start: 'top bottom',
          end: 'bottom top',
        },
      });

      gsap.to('.motion-panel', {
        y: (index) => (index - 1) * -28,
        rotateY: (index) => (index - 1) * 22,
        rotateZ: (index) => (index - 1) * 4,
        ease: 'none',
        scrollTrigger: {
          trigger: '.construction',
          scrub: true,
          start: 'top bottom',
          end: 'bottom top',
        },
      });

      document.querySelectorAll('[data-tilt]').forEach((element) => {
        const onMove = (event) => {
          const rect = element.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          gsap.to(element, {
            rotateX: -y * 8,
            rotateY: x * 10,
            z: Math.abs(x) * 16,
            transformPerspective: 1000,
            duration: 0.35,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        };
        const onLeave = () => {
          gsap.to(element, {
            rotateX: 0,
            rotateY: 0,
            z: 0,
            duration: 0.55,
            ease: 'elastic.out(1, 0.45)',
            overwrite: 'auto',
          });
        };
        element.addEventListener('pointermove', onMove);
        element.addEventListener('pointerleave', onLeave);
        tiltCleanups.push(() => {
          element.removeEventListener('pointermove', onMove);
          element.removeEventListener('pointerleave', onLeave);
        });
      });
    });

    return () => {
      tiltCleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <Header />
      <main>
        <Hero />
        <Marquee3D />
        <Engineering />
        <Movement />
        <Preorder />
      </main>
      <footer className="site-footer">
        <span>OSCAR SWIM</span>
        <a href="#top">Вернуться к Оскару</a>
      </footer>
    </>
  );
}

export default App;

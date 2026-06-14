import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowDown,
  Check,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Waves,
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
    icon: ShieldCheck,
    title: 'Инженерная посадка',
    text: 'Поддерживающая линия держит силуэт без лишней компрессии и не спорит с движением.',
  },
  {
    icon: Sparkles,
    title: 'Латунная фурнитура',
    text: 'Регулируемые элементы работают как ювелирный акцент и дают точную настройку посадки.',
  },
  {
    icon: Waves,
    title: 'Матовая ткань',
    text: 'Черная поверхность гасит блики, быстро выглядит сухой и сохраняет премиальную фактуру.',
  },
];

const timeline = [
  ['01', 'Бронь', 'Оставьте контакт и размер, чтобы попасть в первую волну выпуска.'],
  ['02', 'Подтверждение', 'Мы уточним параметры партии и отправим персональное подтверждение.'],
  ['03', 'Доставка', 'После готовности вы получите ссылку на оплату и удобный способ доставки.'],
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

      const group = new THREE.Group();
      scene.add(group);

      const gold = new THREE.MeshStandardMaterial({
        color: 0xc6a34a,
        roughness: 0.28,
        metalness: 0.82,
        emissive: 0x1b1300,
        emissiveIntensity: 0.18,
      });
      const smoke = new THREE.MeshStandardMaterial({
        color: 0x111414,
        roughness: 0.55,
        metalness: 0.36,
        transparent: true,
        opacity: 0.72,
      });

      const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.32, 0.024, 220, 12, 3, 5), gold);
      knot.position.set(2.45, -0.25, -1.6);
      knot.rotation.set(0.65, 0.25, -0.1);
      group.add(knot);

      const haloA = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.012, 16, 260), smoke);
      haloA.rotation.set(1.2, 0.16, 0.2);
      group.add(haloA);

      const haloB = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.018, 16, 240), gold);
      haloB.position.set(-2.1, 0.78, -1.2);
      haloB.rotation.set(1.1, -0.5, -0.4);
      group.add(haloB);

      const particles = new THREE.BufferGeometry();
      const particleCount = 190;
      const positions = new Float32Array(particleCount * 3);
      for (let index = 0; index < particleCount; index += 1) {
        positions[index * 3] = (Math.random() - 0.5) * 9;
        positions[index * 3 + 1] = (Math.random() - 0.5) * 6;
        positions[index * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
      }
      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const pointMaterial = new THREE.PointsMaterial({
        size: 0.018,
        color: 0xd8bf67,
        transparent: true,
        opacity: 0.62,
        depthWrite: false,
      });
      const points = new THREE.Points(particles, pointMaterial);
      scene.add(points);

      const lightA = new THREE.PointLight(0xf5d66a, 5, 12);
      lightA.position.set(2.5, 2.7, 3.5);
      scene.add(lightA);
      const lightB = new THREE.PointLight(0xffffff, 2.3, 10);
      lightB.position.set(-3.2, -1.8, 4);
      scene.add(lightB);
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
        pointerX = (event.clientX / window.innerWidth - 0.5) * 0.6;
        pointerY = (event.clientY / window.innerHeight - 0.5) * 0.4;
      };

      window.addEventListener('resize', resize);
      window.addEventListener('pointermove', onPointerMove);
      resize();

      let raf = 0;
      const clock = new THREE.Clock();
      const render = () => {
        const elapsed = clock.getElapsedTime();
        if (!prefersReducedMotion) {
          group.rotation.y = elapsed * 0.08 + pointerX;
          group.rotation.x = -pointerY;
          knot.rotation.z = elapsed * 0.18;
          haloA.rotation.z = elapsed * 0.05;
          haloB.rotation.x = 1.1 + Math.sin(elapsed * 0.45) * 0.12;
          points.rotation.y = elapsed * 0.025;
        }
        renderer.render(scene, camera);
        raf = requestAnimationFrame(render);
      };
      render();

      cleanupScene = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', onPointerMove);
        knot.geometry.dispose();
        haloA.geometry.dispose();
        haloB.geometry.dispose();
        particles.dispose();
        gold.dispose();
        smoke.dispose();
        pointMaterial.dispose();
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
        <span>SUPPORT</span>
        <span>SWIM</span>
      </a>
      <nav aria-label="Основная навигация">
        <a href="#engineering">Посадка</a>
        <a href="#movement">Сцена</a>
        <a href="#preorder">Предзаказ</a>
      </nav>
      <a className="header-cta" href="#preorder">
        Забронировать
        <ChevronRight aria-hidden="true" size={16} />
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero section" id="top">
      <ThreeScene />
      <div className="hero-copy reveal">
        <h1>Плавки с поддержкой</h1>
        <p>
          Черная матовая капсула для воды, солнца и движения. Регулируемые ремни,
          латунная фурнитура и посадка, которая выглядит собранно без лишнего объема.
        </p>
        <div className="hero-actions">
          <a className="primary-button magnetic" href="#preorder">
            Предзаказ
            <ChevronRight aria-hidden="true" size={18} />
          </a>
          <a className="text-link" href="#engineering">
            Смотреть конструкцию
            <ArrowDown aria-hidden="true" size={16} />
          </a>
        </div>
      </div>

      <div className="product-stage reveal" data-depth-card>
        <div className="stage-ring ring-one" />
        <div className="stage-ring ring-two" />
        <img src={productImage} alt="Черные плавки с поддерживающими ремнями" />
        <div className="spec-chip chip-left">Матовая ткань</div>
        <div className="spec-chip chip-right">Латунная фурнитура</div>
      </div>
    </section>
  );
}

function DetailCard({ item, index }) {
  const Icon = item.icon;
  return (
    <article className="detail-card reveal" style={{ '--delay': `${index * 0.08}s` }}>
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
        <span>SUPPORT SWIM</span>
        <h2>Инженерная посадка без визуального шума</h2>
      </div>
      <div className="detail-grid">
        {details.map((item, index) => (
          <DetailCard key={item.title} item={item} index={index} />
        ))}
      </div>
      <div className="construction reveal">
        <div className="construction-copy">
          <h3>Регулировка держит линию, а не внимание</h3>
          <p>
            Ремни работают как архитектурная поддержка: фиксируют верхнюю линию,
            оставляют свободу бедру и добавляют жесткий золотой акцент.
          </p>
        </div>
        <div className="construction-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}

function Movement() {
  return (
    <section className="section movement" id="movement">
      <div className="lifestyle-frame reveal">
        <img src={lifestyleImage} alt="Плавки в outdoor-сцене у реки и холмов" />
      </div>
      <div className="movement-copy reveal">
        <h2>Из темной витрины — прямо на солнце</h2>
        <p>
          Плавки не требуют стерильной студии. Они рассчитаны на траву, реку,
          ветер, движение и резкий дневной свет.
        </p>
        <div className="motion-line">
          <span />
          <strong>скульптурный силуэт</strong>
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
        <h2>Забронировать пару</h2>
        <p>
          Первая партия собирается ограниченным тиражом. Предзаказ фиксирует размер,
          цвет фурнитуры и место в очереди без оплаты на сайте.
        </p>
        <div className="drop-list">
          {timeline.map(([number, title, text]) => (
            <div className="drop-step" key={number}>
              <span>{number}</span>
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form className="order-panel reveal" onSubmit={submit}>
        <div className="order-preview">
          <img src={productImage} alt="" aria-hidden="true" />
          <div>
            <span>SUPPORT SWIM</span>
            <strong>{new Intl.NumberFormat('ru-RU').format(total)} ₽</strong>
          </div>
        </div>

        <label className="field">
          <span>Имя</span>
          <input
            required
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Как к вам обращаться"
          />
        </label>

        <label className="field">
          <span>Телефон или Telegram</span>
          <input
            required
            value={form.contact}
            onChange={(event) => setForm((current) => ({ ...current, contact: event.target.value }))}
            placeholder="+7 или @username"
          />
        </label>

        <div className="control-group">
          <span className="control-label">Размер</span>
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
          <span className="control-label">Акцент</span>
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
          <span>Количество</span>
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
              Заявка зафиксирована
            </>
          ) : (
            <>
              Отправить предзаказ
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
    const context = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 42, rotateX: -5 },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            duration: 0.95,
            ease: 'power3.out',
            delay: Number(element.style.getPropertyValue('--delay').replace('s', '')) || 0,
            scrollTrigger: {
              trigger: element,
              start: 'top 82%',
            },
          },
        );
      });

      gsap.to('.product-stage img', {
        yPercent: -6,
        rotateZ: 1.8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          scrub: true,
          start: 'top top',
          end: 'bottom top',
        },
      });

      gsap.to('.lifestyle-frame img', {
        scale: 1.12,
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.movement',
          scrub: true,
          start: 'top bottom',
          end: 'bottom top',
        },
      });
    });

    return () => context.revert();
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Engineering />
        <Movement />
        <Preorder />
      </main>
      <footer className="site-footer">
        <span>SUPPORT SWIM</span>
        <a href="#top">Вернуться наверх</a>
      </footer>
    </>
  );
}

export default App;

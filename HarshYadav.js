/**
 * ============================================================================
 * LOVELY PROFESSIONAL UNIVERSITY (LPU) - DIGITAL LAB EQUIPMENT BOOKING PORTAL
 * Interactive Frontend Engine, Animated Canvas Background & State Controller
 * ============================================================================
 */

(function () {
  'use strict';

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  const today = () => {
    const d = new Date();
    return new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  };

  const esc = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));

  const nid = (arr) => Math.max(0, ...arr.map((x) => x.id)) + 1;

  let S = null;
  let user = null;
  let tab = 'cat';
  let online = false;
  let q = '';
  let cf = '';
  let sel = { eq: 1, date: today(), s: '10:00', f: '12:00' };
  let currentTheme = localStorage.getItem('lpu_theme') || 'light';
  let activePassBooking = null;

  const ADMIN_PASS = 'admin123';

  // Seed Data for Lovely Professional University
  const seed = () => {
    const d = today();
    return {
      eq: [
        {
          id: 1,
          name: 'Digital Storage Oscilloscope 100MHz (4-Channel)',
          lab: 'Electronics Lab 102 (Block 34)',
          cat: 'Electronics',
          school: 'School of Electronics & Electrical Engineering',
          model: 'Tektronix TBS2104B',
          icon: '⚡',
          specs: '100 MHz Bandwidth, 4 analog channels, 2 GS/s sample rate, 5M point record length'
        },
        {
          id: 2,
          name: 'Field Emission Scanning Electron Microscope (FE-SEM)',
          lab: 'Central Instrumentation Facility (Block 38)',
          cat: 'Microscopy',
          school: 'School of Chemical Engineering & Physical Sciences',
          model: 'JEOL JSM-7610FPlus',
          icon: '🔬',
          specs: 'Resolution up to 0.8nm, In-lens Schottky emission gun, EDS elemental mapping'
        },
        {
          id: 3,
          name: 'High-Performance GPU AI Server (NVIDIA A100 80GB)',
          lab: 'AI & Deep Learning Research Lab (Block 36)',
          cat: 'Computing',
          school: 'School of Computer Science & Engineering',
          model: 'NVIDIA DGX Station A100',
          icon: '🖥️',
          specs: '4x NVIDIA A100 GPUs, 320GB Tensor Core memory, Dual AMD EPYC 7742 64-core CPUs'
        },
        {
          id: 4,
          name: 'Industrial SLA High-Precision 3D Printer',
          lab: 'Innovation & Prototyping Hub (Block 28)',
          cat: 'Fabrication',
          school: 'School of Mechanical Engineering',
          model: 'Formlabs Form 3+ SLA',
          icon: '🖨️',
          specs: '25-micron laser spot, 25-300 micron layer thickness, biocompatible resin capable'
        },
        {
          id: 5,
          name: 'UV-Vis Double Beam Spectrophotometer',
          lab: 'Analytical Chemistry Lab 204 (Block 37)',
          cat: 'Chemistry',
          school: 'School of Chemical Engineering & Physical Sciences',
          model: 'Shimadzu UV-2600i',
          icon: '🧪',
          specs: '190 nm to 1400 nm range, dual monochromator, ultra-low stray light'
        },
        {
          id: 6,
          name: 'Real-Time Thermal Cycler qPCR System',
          lab: 'Genomics & Molecular Biology Lab (Block 35)',
          cat: 'Biology',
          school: 'School of Bioengineering & Biosciences',
          model: 'Applied Biosystems QuantStudio 5',
          icon: '🧬',
          specs: '96-well 0.2 mL Peltier block, 6 decoupled excitation filters, multiplexing capability'
        },
        {
          id: 7,
          name: 'Industrial 6-Axis Articulated Robotic Arm',
          lab: 'Robotics & Industry 4.0 Lab (Block 29)',
          cat: 'Robotics',
          school: 'School of Mechanical & Mechatronics',
          model: 'KUKA KR 6 R900 sixx',
          icon: '🤖',
          specs: '6 kg payload, 901 mm reach, smartPAD teaching pendant, EtherCAT bus'
        },
        {
          id: 8,
          name: 'High-Speed Refrigerated Centrifuge (20,000 RPM)',
          lab: 'Biotechnology & Cell Culture Lab (Block 35)',
          cat: 'Biology',
          school: 'School of Bioengineering & Biosciences',
          model: 'Eppendorf 5810R',
          icon: '🌀',
          specs: '-9°C to +40°C temperature control, max RCF 20,913 x g, aerosol-tight rotor'
        },
        {
          id: 9,
          name: 'Vector Network Analyzer (VNA 20 GHz)',
          lab: 'RF, Microwave & Antenna Lab (Block 34)',
          cat: 'Electronics',
          school: 'School of Electronics & Communication',
          model: 'Keysight E5071C ENA',
          icon: '📡',
          specs: '300 kHz to 20 GHz frequency range, 130 dB dynamic range, S-parameter test set'
        },
        {
          id: 10,
          name: 'IoT & Edge Embedded Sensor Workbench',
          lab: 'Smart Systems & IoT Lab (Block 36)',
          cat: 'Computing',
          school: 'School of Computer Science & Engineering',
          model: 'LPU IoT Master Kit v3',
          icon: '💡',
          specs: 'ESP32-S3, Raspberry Pi 5 8GB, LoRaWAN Gateway, environmental & optical sensor array'
        }
      ],
      bk: [
        {
          id: 1,
          eq: 1,
          user: 'Riya Sharma',
          role: 'student',
          dept: 'School of Electronics & Comm.',
          date: d,
          start: '10:00',
          end: '12:00',
          purpose: 'High-frequency signal waveform distortion analysis for final year capstone',
          st: 'approved'
        },
        {
          id: 2,
          eq: 3,
          user: 'Aman Verma',
          role: 'student',
          dept: 'School of Computer Science',
          date: d,
          start: '14:00',
          end: '17:00',
          purpose: 'Fine-tuning multimodal vision-language model for automated defect detection',
          st: 'pending'
        },
        {
          id: 3,
          eq: 2,
          user: 'Dr. Harpreet Singh',
          role: 'faculty',
          dept: 'School of AI & Robotics',
          date: d,
          start: '13:00',
          end: '15:00',
          purpose: 'Surface nanostructure topology scanning for DST research grant',
          st: 'approved'
        }
      ],
      mt: [
        {
          id: 1,
          eq: 5,
          date: d,
          reason: 'Deuterium and Tungsten lamp calibration and photometric verification'
        }
      ],
      nt: [
        {
          id: 1,
          to: 'admin',
          msg: 'Welcome to Lovely Professional University Central Equipment Booking Admin Console.',
          time: new Date().toLocaleString()
        },
        {
          id: 2,
          to: 'Riya Sharma',
          msg: 'Your booking for Digital Storage Oscilloscope on ' + d + ' (10:00–12:00) has been APPROVED.',
          time: new Date().toLocaleString()
        }
      ]
    };
  };

  async function load() {
    try {
      const r = await fetch('/api/state');
      if (!r.ok) throw new Error('Server returned non-200');
      S = await r.json();
      online = true;
    } catch (e) {
      try {
        const stored = localStorage.getItem('lpulabs_v2');
        if (stored) S = JSON.parse(stored);
      } catch (err) {}
      online = false;
    }

    if (!S || !S.eq || !Array.isArray(S.eq)) {
      S = seed();
      await save();
    }
  }

  async function save() {
    if (online) {
      try {
        const r = await fetch('/api/state', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(S)
        });
        if (!r.ok) {
          const errData = await r.json().catch(() => ({}));
          toast('Sync error: ' + (errData.error || 'Unable to update server'));
          await load();
          render();
          return false;
        }
      } catch (e) {
        online = false;
      }
    }
    try {
      localStorage.setItem('lpulabs_v2', JSON.stringify(S));
    } catch (e) {}
    return true;
  }

  function toast(msg) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t.timer);
    t.timer = setTimeout(() => {
      t.classList.remove('show');
    }, 3500);
  }

  const E = (id) => S.eq.find((e) => e.id == id) || { name: 'Unknown Equipment', lab: 'Central Lab', icon: '🔬' };

  const st = (b) => {
    if (b.st === 'approved' && b.date < today()) return 'completed';
    return b.st;
  };

  const note = (to, msg) => {
    S.nt.push({
      id: nid(S.nt),
      to,
      msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + today()
    });
  };

  function clash(b) {
    const m = S.mt.find((x) => x.eq == b.eq && x.date == b.date);
    if (m) return 'Resource is blocked for maintenance on this date: ' + m.reason;
    if (b.date < today()) return 'Cannot book a past date.';
    if (b.start >= b.end) return 'End time must be later than start time.';

    const conflict = S.bk.find(
      (x) =>
        x.id != b.id &&
        x.eq == b.eq &&
        x.date == b.date &&
        ['pending', 'approved'].includes(x.st) &&
        b.start < x.end &&
        x.start < b.end
    );

    return conflict
      ? Slot conflicts with an existing reservation (${conflict.start}–${conflict.end} by ${conflict.user})
      : '';
}
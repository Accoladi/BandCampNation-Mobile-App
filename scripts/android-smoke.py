"""Native Android smoke test. Run against the embedded-bundle demo APK.

ANDROID_SERIAL selects a device; ANDROID_HOME or PATH must supply adb.
Screenshots/report go to artifacts/qa-android. Temporary device settings are restored.
"""
import datetime
import json
import os
import re
import shutil
import subprocess
import time
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'artifacts/qa-android'
ADB = shutil.which('adb') or str(Path(os.environ['ANDROID_HOME']) / 'platform-tools/adb')
PACKAGE = 'com.bandcampnation.mobile'
RESULTS = []


def adb(*args):
    return subprocess.check_output([ADB, *args], timeout=40)


def tree():
    result = adb('shell', 'uiautomator', 'dump', '/sdcard/bcn-smoke.xml')
    if b'dumped to' not in result:
        raise RuntimeError('No fresh idle accessibility tree; stale XML is never accepted')
    return ET.fromstring(adb('exec-out', 'cat', '/sdcard/bcn-smoke.xml'))


def tap(label):
    for _ in range(12):
        nodes = list(tree().iter('node'))
        for node in nodes:
            if label.casefold() not in (node.get('text', '').casefold(), node.get('content-desc', '').casefold()):
                continue
            x1, y1, x2, y2 = map(int, re.findall(r'\d+', node.get('bounds')))
            if x2 > x1 and y2 - y1 >= 24 and (y1 + y2) / 2 < HEIGHT * .93:
                adb('shell', 'input', 'tap', str((x1 + x2) // 2), str((y1 + y2) // 2))
                return
        if any(node.get('content-desc') in ('Open navigation', 'Close navigation') for node in nodes):
            adb('shell', 'input', 'swipe', str(WIDTH // 2), str(int(HEIGHT * .78)), str(WIDTH // 2), str(int(HEIGHT * .34)), '350')
        else:
            time.sleep(1)
    raise AssertionError(f'Missing visible control: {label}')


def expect(label):
    for _ in range(8):
        values = [value.casefold() for node in tree().iter('node') for value in (node.get('text', ''), node.get('content-desc', ''))]
        if label.casefold() in values:
            return
        time.sleep(.5)
    raise AssertionError(f'Missing state: {label}')


def top():
    for _ in range(3):
        adb('shell', 'input', 'swipe', str(WIDTH // 2), str(int(HEIGHT * .28)), str(WIDTH // 2), str(int(HEIGHT * .82)), '250')


def menu(destination):
    tap('Open navigation')
    tap(destination)


def evidence(name):
    tree()
    (OUT / f'{name}.png').write_bytes(adb('exec-out', 'screencap', '-p'))
    RESULTS.append(name)
    print(f'PASS: {name}', flush=True)


def network(enabled):
    action = 'enable' if enabled else 'disable'
    adb('shell', 'svc', 'wifi', action)
    adb('shell', 'svc', 'data', action)


OUT.mkdir(parents=True, exist_ok=True)
WIDTH, HEIGHT = map(int, re.findall(r'(\d+)x(\d+)', adb('shell', 'wm', 'size').decode())[-1])
font = adb('shell', 'settings', 'get', 'system', 'font_scale').decode().strip()
wifi = adb('shell', 'settings', 'get', 'global', 'wifi_on').decode().strip()
data = adb('shell', 'settings', 'get', 'global', 'mobile_data').decode().strip()
try:
    adb('shell', 'am', 'force-stop', PACKAGE)
    adb('shell', 'am', 'start', '-W', '-n', f'{PACKAGE}/.MainActivity')
    expect('Open navigation')
    evidence('home')

    network(False)
    menu('Articles')
    expect('15 articles')
    tap('Read Is Marching Band a Sport or Something More?')
    expect('Available offline')
    evidence('offline-article')
    menu('Books')
    tap('Read The Stories Behind Marching Band')
    tap('Preface')
    expect('Available offline')
    evidence('offline-book')
    network(True)

    menu('Radio')
    # A transient initial request can be retried through the real user action.
    time.sleep(2)
    if any(node.get('content-desc') == 'Retry radio' for node in tree().iter('node')):
        tap('Retry radio')
    tap('Play track')
    expect('Playing')
    evidence('radio-playing')
    adb('shell', 'input', 'keyevent', '3')
    time.sleep(2)
    adb('shell', 'am', 'start', '-W', '-n', f'{PACKAGE}/.MainActivity')
    expect('Paused')
    evidence('background-paused')
    tap('Next track')
    expect('Playing')
    tap('Pause track')
    expect('Paused')

    menu('Entertainment')
    tap('Play Trivia')
    tap('Start trivia')
    answers = ['University of Texas', '76', '120', 'Adjudicator', 'University of Notre Dame', 'The pit', '7 to 9 minutes', 'General effect', 'To conduct the band', 'Snare drum']
    for index, answer in enumerate(answers):
        top()
        expect(f'Question {index + 1} of 10')
        tap(answer)
        tap('See results' if index == 9 else 'Next question')
    top()
    expect('10 / 10')
    evidence('trivia-complete')
    tap('Play again')
    top()
    expect('Question 1 of 10')

    menu('Entertainment')
    tap('Play Tic Tap Tone')
    tap('Two players')
    for cell in [0, 1, 2, 4, 3, 5, 7, 6, 8]:
        tap(f'Row {cell // 3 + 1}, column {cell % 3 + 1}, empty')
    top()
    expect("It's a tie")
    evidence('tic-tie')

    network(False)
    menu('Entertainment')
    tap('Play Name That Tune')
    tap('Start game')
    tap('Listen to clip')
    expect('Choose the tune')
    tap('Use a clue')
    evidence('offline-audio-game')
    network(True)

    adb('shell', 'settings', 'put', 'system', 'font_scale', '2.0')
    tap('BandCampNation home')
    menu('Entertainment')
    expect('Break starts here')
    evidence('large-text')
finally:
    adb('shell', 'settings', 'put', 'system', 'font_scale', font if font != 'null' else '1.0')
    if wifi in ('0', '1'):
        adb('shell', 'svc', 'wifi', 'enable' if wifi == '1' else 'disable')
    if data in ('0', '1'):
        adb('shell', 'svc', 'data', 'enable' if data == '1' else 'disable')
    (OUT / 'report.json').write_text(json.dumps({
        'performedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'package': PACKAGE, 'nativeRuntime': 'Android',
        'apiLevel': adb('shell', 'getprop', 'ro.build.version.sdk').decode().strip(),
        'passed': RESULTS, 'complete': len(RESULTS) == 9,
    }, indent=2) + '\n')

// End-to-end: Jarvis's real AiService -> StudEx jarvis-llm-proxy -> (fake) Ollama.
// Needs a running proxy; skipped unless STUDEX_PROXY_URL and STUDEX_BRIDGE_KEY are set.
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:private_agent/services/ai_service.dart';
import 'package:private_agent/services/settings_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  final proxyUrl = Platform.environment['STUDEX_PROXY_URL'] ?? '';
  final bridgeKey = Platform.environment['STUDEX_BRIDGE_KEY'] ?? '';
  final skip = proxyUrl.isEmpty || bridgeKey.isEmpty
      ? 'set STUDEX_PROXY_URL and STUDEX_BRIDGE_KEY'
      : null;

  Future<void> configure(String key) async {
    SharedPreferences.setMockInitialValues({});
    final s = SettingsService.instance;
    await s.init();
    await s.setProvider('custom');
    await s.setBaseUrl(proxyUrl);
    await s.setApiKey(key);
    await s.setModel('studex');
  }

  group('Jarvis -> StudEx proxy', () {
    test('streamed chat (what the chat screen uses) returns the reply', () async {
      await configure(bridgeKey);
      final parts = await AiService.instance
          .chatStream(message: 'ping from jarvis')
          .toList();
      final reply = parts.join();
      expect(reply, contains('Hello from fake ollama'));
      expect(reply, contains('ping from jarvis'));
    }, skip: skip);

    test('non-streamed chat returns the reply', () async {
      await configure(bridgeKey);
      final reply = await AiService.instance.chat(message: 'second ping');
      expect(reply, contains('second ping'));
    }, skip: skip);

    test('wrong bridge key is refused with 401', () async {
      await configure('wrong-key');
      await expectLater(
        AiService.instance.chat(message: 'should fail'),
        throwsA(isA<AiException>()
            .having((e) => e.statusCode, 'statusCode', 401)),
      );
    }, skip: skip);
  });
}

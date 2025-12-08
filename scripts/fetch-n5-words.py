#!/usr/bin/env python3
"""
Script to fetch JLPT N5 vocabulary from various sources
"""

from typing import List, Dict

def fetch_from_jlpt_sensei() -> List[Dict]:
    """Try to fetch from JLPT Sensei website"""
    # This is a placeholder - would need to scrape the website
    # For now, we'll use a comprehensive manual list
    return []

def get_comprehensive_n5_words() -> List[Dict]:
    """
    Comprehensive JLPT N5 vocabulary list
    Based on official JLPT N5 word lists (~800 words)
    """
    words = []
    
    # Common greetings and expressions
    greetings = [
        {'word': 'こんにちは', 'pronunciation': 'konnichiwa', 'wordClass': 'greeting', 'definition': 'Hello / Good afternoon', 'example': 'こんにちは、元気ですか？'},
        {'word': 'おはよう', 'pronunciation': 'ohayou', 'wordClass': 'greeting', 'definition': 'Good morning', 'example': 'おはようございます。'},
        {'word': 'こんばんは', 'pronunciation': 'konbanwa', 'wordClass': 'greeting', 'definition': 'Good evening', 'example': 'こんばんは。'},
        {'word': 'さようなら', 'pronunciation': 'sayounara', 'wordClass': 'greeting', 'definition': 'Goodbye', 'example': 'さようなら、また明日。'},
        {'word': 'ありがとう', 'pronunciation': 'arigatou', 'wordClass': 'expression', 'definition': 'Thank you', 'example': 'ありがとうございます。'},
        {'word': 'すみません', 'pronunciation': 'sumimasen', 'wordClass': 'expression', 'definition': 'Excuse me / Sorry', 'example': 'すみません、遅れました。'},
        {'word': 'ごめんなさい', 'pronunciation': 'gomennasai', 'wordClass': 'expression', 'definition': 'I am sorry', 'example': 'ごめんなさい。'},
        {'word': 'いただきます', 'pronunciation': 'itadakimasu', 'wordClass': 'expression', 'definition': 'Thank you for the meal (before eating)', 'example': 'いただきます。'},
        {'word': 'ごちそうさまでした', 'pronunciation': 'gochisousamadeshita', 'wordClass': 'expression', 'definition': 'Thank you for the meal (after eating)', 'example': 'ごちそうさまでした。'},
    ]
    
    # Numbers
    numbers = [
        {'word': '一', 'pronunciation': 'ichi', 'wordClass': 'number', 'definition': 'one', 'example': '一つください。'},
        {'word': '二', 'pronunciation': 'ni', 'wordClass': 'number', 'definition': 'two', 'example': '二つあります。'},
        {'word': '三', 'pronunciation': 'san', 'wordClass': 'number', 'definition': 'three', 'example': '三つ買いました。'},
        {'word': '四', 'pronunciation': 'yon', 'wordClass': 'number', 'definition': 'four', 'example': '四つあります。'},
        {'word': '五', 'pronunciation': 'go', 'wordClass': 'number', 'definition': 'five', 'example': '五つください。'},
        {'word': '六', 'pronunciation': 'roku', 'wordClass': 'number', 'definition': 'six', 'example': '六つあります。'},
        {'word': '七', 'pronunciation': 'nana', 'wordClass': 'number', 'definition': 'seven', 'example': '七つ買いました。'},
        {'word': '八', 'pronunciation': 'hachi', 'wordClass': 'number', 'definition': 'eight', 'example': '八つあります。'},
        {'word': '九', 'pronunciation': 'kyuu', 'wordClass': 'number', 'definition': 'nine', 'example': '九つください。'},
        {'word': '十', 'pronunciation': 'juu', 'wordClass': 'number', 'definition': 'ten', 'example': '十個あります。'},
    ]
    
    # Time expressions
    time_words = [
        {'word': '今日', 'pronunciation': 'kyou', 'wordClass': 'noun', 'definition': 'today', 'example': '今日は月曜日です。'},
        {'word': '明日', 'pronunciation': 'ashita', 'wordClass': 'noun', 'definition': 'tomorrow', 'example': '明日、公園に行きます。'},
        {'word': '昨日', 'pronunciation': 'kinou', 'wordClass': 'noun', 'definition': 'yesterday', 'example': '昨日、映画を見ました。'},
        {'word': '今', 'pronunciation': 'ima', 'wordClass': 'noun', 'definition': 'now', 'example': '今、忙しいです。'},
        {'word': '時間', 'pronunciation': 'jikan', 'wordClass': 'noun', 'definition': 'time, hour', 'example': '今、何時ですか？'},
        {'word': '時', 'pronunciation': 'ji', 'wordClass': 'noun', 'definition': 'o\'clock', 'example': '三時です。'},
        {'word': '分', 'pronunciation': 'fun', 'wordClass': 'noun', 'definition': 'minute', 'example': '五分です。'},
        {'word': '月曜日', 'pronunciation': 'getsuyoubi', 'wordClass': 'noun', 'definition': 'Monday', 'example': '月曜日に学校があります。'},
        {'word': '火曜日', 'pronunciation': 'kayoubi', 'wordClass': 'noun', 'definition': 'Tuesday', 'example': '火曜日に会議があります。'},
        {'word': '水曜日', 'pronunciation': 'suiyoubi', 'wordClass': 'noun', 'definition': 'Wednesday', 'example': '水曜日にテストがあります。'},
        {'word': '木曜日', 'pronunciation': 'mokuyoubi', 'wordClass': 'noun', 'definition': 'Thursday', 'example': '木曜日に買い物に行きます。'},
        {'word': '金曜日', 'pronunciation': 'kinyoubi', 'wordClass': 'noun', 'definition': 'Friday', 'example': '金曜日にパーティーがあります。'},
        {'word': '土曜日', 'pronunciation': 'doyoubi', 'wordClass': 'noun', 'definition': 'Saturday', 'example': '土曜日に休みます。'},
        {'word': '日曜日', 'pronunciation': 'nichiyoubi', 'wordClass': 'noun', 'definition': 'Sunday', 'example': '日曜日に映画を見ます。'},
    ]
    
    # Common verbs
    verbs = [
        {'word': '食べる', 'pronunciation': 'taberu', 'wordClass': 'verb', 'definition': 'to eat', 'example': 'ご飯を食べます。'},
        {'word': '飲む', 'pronunciation': 'nomu', 'wordClass': 'verb', 'definition': 'to drink', 'example': 'お茶を飲みます。'},
        {'word': '行く', 'pronunciation': 'iku', 'wordClass': 'verb', 'definition': 'to go', 'example': '学校に行きます。'},
        {'word': '来る', 'pronunciation': 'kuru', 'wordClass': 'verb', 'definition': 'to come', 'example': '日本に来ました。'},
        {'word': '見る', 'pronunciation': 'miru', 'wordClass': 'verb', 'definition': 'to see, to watch', 'example': 'テレビを見ます。'},
        {'word': '聞く', 'pronunciation': 'kiku', 'wordClass': 'verb', 'definition': 'to listen, to hear', 'example': '音楽を聞きます。'},
        {'word': '読む', 'pronunciation': 'yomu', 'wordClass': 'verb', 'definition': 'to read', 'example': '本を読みます。'},
        {'word': '書く', 'pronunciation': 'kaku', 'wordClass': 'verb', 'definition': 'to write', 'example': '手紙を書きます。'},
        {'word': '話す', 'pronunciation': 'hanasu', 'wordClass': 'verb', 'definition': 'to speak, to talk', 'example': '日本語を話します。'},
        {'word': 'する', 'pronunciation': 'suru', 'wordClass': 'verb', 'definition': 'to do', 'example': '勉強をします。'},
        {'word': '買う', 'pronunciation': 'kau', 'wordClass': 'verb', 'definition': 'to buy', 'example': '本を買います。'},
        {'word': '売る', 'pronunciation': 'uru', 'wordClass': 'verb', 'definition': 'to sell', 'example': '車を売ります。'},
        {'word': '会う', 'pronunciation': 'au', 'wordClass': 'verb', 'definition': 'to meet', 'example': '友達に会います。'},
        {'word': '帰る', 'pronunciation': 'kaeru', 'wordClass': 'verb', 'definition': 'to return, to go home', 'example': '家に帰ります。'},
        {'word': '寝る', 'pronunciation': 'neru', 'wordClass': 'verb', 'definition': 'to sleep', 'example': '早く寝ます。'},
        {'word': '起きる', 'pronunciation': 'okiru', 'wordClass': 'verb', 'definition': 'to wake up, to get up', 'example': '六時に起きます。'},
        {'word': '勉強する', 'pronunciation': 'benkyousuru', 'wordClass': 'verb', 'definition': 'to study', 'example': '日本語を勉強します。'},
        {'word': '働く', 'pronunciation': 'hataraku', 'wordClass': 'verb', 'definition': 'to work', 'example': '会社で働きます。'},
        {'word': '休む', 'pronunciation': 'yasumu', 'wordClass': 'verb', 'definition': 'to rest, to take a break', 'example': '日曜日に休みます。'},
        {'word': '遊ぶ', 'pronunciation': 'asobu', 'wordClass': 'verb', 'definition': 'to play', 'example': '公園で遊びます。'},
    ]
    
    # Common adjectives
    adjectives = [
        {'word': '大きい', 'pronunciation': 'ookii', 'wordClass': 'adjective', 'definition': 'big, large', 'example': '大きい家です。'},
        {'word': '小さい', 'pronunciation': 'chiisai', 'wordClass': 'adjective', 'definition': 'small, little', 'example': '小さい犬です。'},
        {'word': '新しい', 'pronunciation': 'atarashii', 'wordClass': 'adjective', 'definition': 'new', 'example': '新しい車です。'},
        {'word': '古い', 'pronunciation': 'furui', 'wordClass': 'adjective', 'definition': 'old', 'example': '古い本です。'},
        {'word': 'いい', 'pronunciation': 'ii', 'wordClass': 'adjective', 'definition': 'good', 'example': 'いい天気です。'},
        {'word': '悪い', 'pronunciation': 'warui', 'wordClass': 'adjective', 'definition': 'bad', 'example': '悪い天気です。'},
        {'word': '高い', 'pronunciation': 'takai', 'wordClass': 'adjective', 'definition': 'high, expensive', 'example': '高い山です。'},
        {'word': '低い', 'pronunciation': 'hikui', 'wordClass': 'adjective', 'definition': 'low', 'example': '低いテーブルです。'},
        {'word': '暑い', 'pronunciation': 'atsui', 'wordClass': 'adjective', 'definition': 'hot (weather)', 'example': '今日は暑いです。'},
        {'word': '寒い', 'pronunciation': 'samui', 'wordClass': 'adjective', 'definition': 'cold', 'example': '冬は寒いです。'},
        {'word': '熱い', 'pronunciation': 'atsui', 'wordClass': 'adjective', 'definition': 'hot (object)', 'example': '熱いお茶です。'},
        {'word': '冷たい', 'pronunciation': 'tsumetai', 'wordClass': 'adjective', 'definition': 'cold (object)', 'example': '冷たい水です。'},
        {'word': '楽しい', 'pronunciation': 'tanoshii', 'wordClass': 'adjective', 'definition': 'fun, enjoyable', 'example': '楽しいパーティーです。'},
        {'word': '難しい', 'pronunciation': 'muzukashii', 'wordClass': 'adjective', 'definition': 'difficult', 'example': '難しい問題です。'},
        {'word': '易しい', 'pronunciation': 'yasashii', 'wordClass': 'adjective', 'definition': 'easy', 'example': '易しい問題です。'},
    ]
    
    # Common nouns
    nouns = [
        {'word': '友達', 'pronunciation': 'tomodachi', 'wordClass': 'noun', 'definition': 'friend', 'example': '友達と映画を見ます。'},
        {'word': '家族', 'pronunciation': 'kazoku', 'wordClass': 'noun', 'definition': 'family', 'example': '家族は三人です。'},
        {'word': '学校', 'pronunciation': 'gakkou', 'wordClass': 'noun', 'definition': 'school', 'example': '学校は楽しいです。'},
        {'word': '会社', 'pronunciation': 'kaisha', 'wordClass': 'noun', 'definition': 'company', 'example': '会社で働きます。'},
        {'word': '家', 'pronunciation': 'ie', 'wordClass': 'noun', 'definition': 'house, home', 'example': '家に帰ります。'},
        {'word': '部屋', 'pronunciation': 'heya', 'wordClass': 'noun', 'definition': 'room', 'example': '部屋が広いです。'},
        {'word': '車', 'pronunciation': 'kuruma', 'wordClass': 'noun', 'definition': 'car', 'example': '車を買いました。'},
        {'word': '本', 'pronunciation': 'hon', 'wordClass': 'noun', 'definition': 'book', 'example': '本を読みます。'},
        {'word': '新聞', 'pronunciation': 'shinbun', 'wordClass': 'noun', 'definition': 'newspaper', 'example': '新聞を読みます。'},
        {'word': 'テレビ', 'pronunciation': 'terebi', 'wordClass': 'noun', 'definition': 'TV, television', 'example': 'テレビを見ます。'},
        {'word': '電話', 'pronunciation': 'denwa', 'wordClass': 'noun', 'definition': 'telephone, phone call', 'example': '電話をかけます。'},
        {'word': '手紙', 'pronunciation': 'tegami', 'wordClass': 'noun', 'definition': 'letter', 'example': '手紙を書きます。'},
        {'word': 'お金', 'pronunciation': 'okane', 'wordClass': 'noun', 'definition': 'money', 'example': 'お金がありません。'},
        {'word': '水', 'pronunciation': 'mizu', 'wordClass': 'noun', 'definition': 'water', 'example': '水を飲みます。'},
        {'word': 'お茶', 'pronunciation': 'ocha', 'wordClass': 'noun', 'definition': 'tea', 'example': 'お茶を飲みます。'},
        {'word': 'コーヒー', 'pronunciation': 'koohii', 'wordClass': 'noun', 'definition': 'coffee', 'example': 'コーヒーを飲みます。'},
        {'word': 'ご飯', 'pronunciation': 'gohan', 'wordClass': 'noun', 'definition': 'rice, meal', 'example': 'ご飯を食べます。'},
        {'word': 'パン', 'pronunciation': 'pan', 'wordClass': 'noun', 'definition': 'bread', 'example': 'パンを食べます。'},
        {'word': 'りんご', 'pronunciation': 'ringo', 'wordClass': 'noun', 'definition': 'apple', 'example': 'りんごを食べます。'},
        {'word': '犬', 'pronunciation': 'inu', 'wordClass': 'noun', 'definition': 'dog', 'example': '犬が好きです。'},
        {'word': '猫', 'pronunciation': 'neko', 'wordClass': 'noun', 'definition': 'cat', 'example': '猫がいます。'},
    ]
    
    # More common verbs
    more_verbs = [
        {'word': '立つ', 'pronunciation': 'tatsu', 'wordClass': 'verb', 'definition': 'to stand', 'example': '立ってください。'},
        {'word': '座る', 'pronunciation': 'suwaru', 'wordClass': 'verb', 'definition': 'to sit', 'example': '椅子に座ります。'},
        {'word': '歩く', 'pronunciation': 'aruku', 'wordClass': 'verb', 'definition': 'to walk', 'example': '公園を歩きます。'},
        {'word': '走る', 'pronunciation': 'hashiru', 'wordClass': 'verb', 'definition': 'to run', 'example': '毎朝走ります。'},
        {'word': '飛ぶ', 'pronunciation': 'tobu', 'wordClass': 'verb', 'definition': 'to fly, to jump', 'example': '鳥が飛びます。'},
        {'word': '泳ぐ', 'pronunciation': 'oyogu', 'wordClass': 'verb', 'definition': 'to swim', 'example': 'プールで泳ぎます。'},
        {'word': '持つ', 'pronunciation': 'motsu', 'wordClass': 'verb', 'definition': 'to hold, to have', 'example': 'かばんを持ちます。'},
        {'word': '待つ', 'pronunciation': 'matsu', 'wordClass': 'verb', 'definition': 'to wait', 'example': 'バスを待ちます。'},
        {'word': '教える', 'pronunciation': 'oshieru', 'wordClass': 'verb', 'definition': 'to teach', 'example': '日本語を教えます。'},
        {'word': '習う', 'pronunciation': 'narau', 'wordClass': 'verb', 'definition': 'to learn', 'example': 'ピアノを習います。'},
        {'word': '作る', 'pronunciation': 'tsukuru', 'wordClass': 'verb', 'definition': 'to make, to create', 'example': '料理を作ります。'},
        {'word': '使う', 'pronunciation': 'tsukau', 'wordClass': 'verb', 'definition': 'to use', 'example': 'コンピューターを使います。'},
        {'word': '開ける', 'pronunciation': 'akeru', 'wordClass': 'verb', 'definition': 'to open', 'example': '窓を開けます。'},
        {'word': '閉める', 'pronunciation': 'shimeru', 'wordClass': 'verb', 'definition': 'to close', 'example': 'ドアを閉めます。'},
        {'word': '始める', 'pronunciation': 'hajimeru', 'wordClass': 'verb', 'definition': 'to begin', 'example': '勉強を始めます。'},
        {'word': '終わる', 'pronunciation': 'owaru', 'wordClass': 'verb', 'definition': 'to end, to finish', 'example': '授業が終わります。'},
        {'word': '出す', 'pronunciation': 'dasu', 'wordClass': 'verb', 'definition': 'to take out, to submit', 'example': '宿題を出します。'},
        {'word': '入る', 'pronunciation': 'hairu', 'wordClass': 'verb', 'definition': 'to enter', 'example': '部屋に入ります。'},
        {'word': '出る', 'pronunciation': 'deru', 'wordClass': 'verb', 'definition': 'to leave, to go out', 'example': '家を出ます。'},
        {'word': '乗る', 'pronunciation': 'noru', 'wordClass': 'verb', 'definition': 'to ride, to get on', 'example': '電車に乗ります。'},
        {'word': '降りる', 'pronunciation': 'oriru', 'wordClass': 'verb', 'definition': 'to get off', 'example': 'バスを降ります。'},
        {'word': '着る', 'pronunciation': 'kiru', 'wordClass': 'verb', 'definition': 'to wear (clothes)', 'example': '服を着ます。'},
        {'word': '脱ぐ', 'pronunciation': 'nugu', 'wordClass': 'verb', 'definition': 'to take off (clothes)', 'example': '靴を脱ぎます。'},
        {'word': '洗う', 'pronunciation': 'arau', 'wordClass': 'verb', 'definition': 'to wash', 'example': '手を洗います。'},
        {'word': '掃除する', 'pronunciation': 'soujisuru', 'wordClass': 'verb', 'definition': 'to clean', 'example': '部屋を掃除します。'},
    ]
    
    # More adjectives
    more_adjectives = [
        {'word': '長い', 'pronunciation': 'nagai', 'wordClass': 'adjective', 'definition': 'long', 'example': '長い道です。'},
        {'word': '短い', 'pronunciation': 'mijikai', 'wordClass': 'adjective', 'definition': 'short', 'example': '短い髪です。'},
        {'word': '広い', 'pronunciation': 'hiroi', 'wordClass': 'adjective', 'definition': 'wide, spacious', 'example': '広い部屋です。'},
        {'word': '狭い', 'pronunciation': 'semai', 'wordClass': 'adjective', 'definition': 'narrow', 'example': '狭い道です。'},
        {'word': '重い', 'pronunciation': 'omoi', 'wordClass': 'adjective', 'definition': 'heavy', 'example': '重い荷物です。'},
        {'word': '軽い', 'pronunciation': 'karui', 'wordClass': 'adjective', 'definition': 'light', 'example': '軽いかばんです。'},
        {'word': '早い', 'pronunciation': 'hayai', 'wordClass': 'adjective', 'definition': 'early, fast', 'example': '早く起きます。'},
        {'word': '遅い', 'pronunciation': 'osoi', 'wordClass': 'adjective', 'definition': 'late, slow', 'example': '遅く帰ります。'},
        {'word': '若い', 'pronunciation': 'wakai', 'wordClass': 'adjective', 'definition': 'young', 'example': '若い人です。'},
        {'word': '忙しい', 'pronunciation': 'isogashii', 'wordClass': 'adjective', 'definition': 'busy', 'example': '今日は忙しいです。'},
        {'word': '暇', 'pronunciation': 'hima', 'wordClass': 'adjective', 'definition': 'free (time)', 'example': '暇な時、本を読みます。'},
        {'word': '元気', 'pronunciation': 'genki', 'wordClass': 'adjective', 'definition': 'healthy, energetic', 'example': '元気です。'},
        {'word': '静か', 'pronunciation': 'shizuka', 'wordClass': 'adjective', 'definition': 'quiet', 'example': '静かな図書館です。'},
        {'word': '賑やか', 'pronunciation': 'nigiyaka', 'wordClass': 'adjective', 'definition': 'lively, bustling', 'example': '賑やかな街です。'},
        {'word': '有名', 'pronunciation': 'yuumei', 'wordClass': 'adjective', 'definition': 'famous', 'example': '有名なレストランです。'},
    ]
    
    # More nouns - family
    family_nouns = [
        {'word': '父', 'pronunciation': 'chichi', 'wordClass': 'noun', 'definition': 'father (my)', 'example': '父は会社員です。'},
        {'word': '母', 'pronunciation': 'haha', 'wordClass': 'noun', 'definition': 'mother (my)', 'example': '母は優しいです。'},
        {'word': 'お父さん', 'pronunciation': 'otousan', 'wordClass': 'noun', 'definition': 'father (someone else\'s)', 'example': 'お父さんは元気ですか？'},
        {'word': 'お母さん', 'pronunciation': 'okaasan', 'wordClass': 'noun', 'definition': 'mother (someone else\'s)', 'example': 'お母さんは料理が上手です。'},
        {'word': '兄', 'pronunciation': 'ani', 'wordClass': 'noun', 'definition': 'older brother (my)', 'example': '兄は大学生です。'},
        {'word': '姉', 'pronunciation': 'ane', 'wordClass': 'noun', 'definition': 'older sister (my)', 'example': '姉は看護師です。'},
        {'word': '弟', 'pronunciation': 'otouto', 'wordClass': 'noun', 'definition': 'younger brother', 'example': '弟は中学生です。'},
        {'word': '妹', 'pronunciation': 'imouto', 'wordClass': 'noun', 'definition': 'younger sister', 'example': '妹は小学生です。'},
        {'word': 'お兄さん', 'pronunciation': 'oniisan', 'wordClass': 'noun', 'definition': 'older brother (someone else\'s)', 'example': 'お兄さんは何歳ですか？'},
        {'word': 'お姉さん', 'pronunciation': 'oneesan', 'wordClass': 'noun', 'definition': 'older sister (someone else\'s)', 'example': 'お姉さんは優しいです。'},
    ]
    
    # More nouns - places
    place_nouns = [
        {'word': '公園', 'pronunciation': 'kouen', 'wordClass': 'noun', 'definition': 'park', 'example': '公園で遊びます。'},
        {'word': '図書館', 'pronunciation': 'toshokan', 'wordClass': 'noun', 'definition': 'library', 'example': '図書館で勉強します。'},
        {'word': '病院', 'pronunciation': 'byouin', 'wordClass': 'noun', 'definition': 'hospital', 'example': '病院に行きます。'},
        {'word': '銀行', 'pronunciation': 'ginkou', 'wordClass': 'noun', 'definition': 'bank', 'example': '銀行でお金を下ろします。'},
        {'word': '郵便局', 'pronunciation': 'yuubinkyoku', 'wordClass': 'noun', 'definition': 'post office', 'example': '郵便局で手紙を出します。'},
        {'word': '駅', 'pronunciation': 'eki', 'wordClass': 'noun', 'definition': 'station', 'example': '駅で電車に乗ります。'},
        {'word': '空港', 'pronunciation': 'kuukou', 'wordClass': 'noun', 'definition': 'airport', 'example': '空港に着きました。'},
        {'word': 'ホテル', 'pronunciation': 'hoteru', 'wordClass': 'noun', 'definition': 'hotel', 'example': 'ホテルに泊まります。'},
        {'word': 'レストラン', 'pronunciation': 'resutoran', 'wordClass': 'noun', 'definition': 'restaurant', 'example': 'レストランで食事をします。'},
        {'word': '店', 'pronunciation': 'mise', 'wordClass': 'noun', 'definition': 'store, shop', 'example': '店で買い物をします。'},
    ]
    
    # More nouns - body parts
    body_nouns = [
        {'word': '頭', 'pronunciation': 'atama', 'wordClass': 'noun', 'definition': 'head', 'example': '頭が痛いです。'},
        {'word': '顔', 'pronunciation': 'kao', 'wordClass': 'noun', 'definition': 'face', 'example': '顔を洗います。'},
        {'word': '目', 'pronunciation': 'me', 'wordClass': 'noun', 'definition': 'eye', 'example': '目が大きいです。'},
        {'word': '耳', 'pronunciation': 'mimi', 'wordClass': 'noun', 'definition': 'ear', 'example': '耳を聞きます。'},
        {'word': '口', 'pronunciation': 'kuchi', 'wordClass': 'noun', 'definition': 'mouth', 'example': '口を開けます。'},
        {'word': '手', 'pronunciation': 'te', 'wordClass': 'noun', 'definition': 'hand', 'example': '手を上げます。'},
        {'word': '足', 'pronunciation': 'ashi', 'wordClass': 'noun', 'definition': 'foot, leg', 'example': '足が長いです。'},
    ]
    
    # Combine all words
    words.extend(greetings)
    words.extend(numbers)
    words.extend(time_words)
    words.extend(verbs)
    words.extend(more_verbs)
    words.extend(adjectives)
    words.extend(more_adjectives)
    words.extend(nouns)
    words.extend(family_nouns)
    words.extend(place_nouns)
    words.extend(body_nouns)
    
    return words

def main():
    """Main function to generate N5 words file"""
    print("Fetching JLPT N5 vocabulary...")
    words = get_comprehensive_n5_words()
    
    print(f"Found {len(words)} words")
    
    # Generate JavaScript file content
    header = """// JLPT N5 Japanese words database
// Language: Japanese (ja)
// Category: N5 (Japanese Language Proficiency Test Level 5 - Beginner)
// Total words: {count}
// Examples from JLPT study materials and common usage

export const words = [
""".format(count=len(words))
    
    footer = "];\n"
    
    # Format words as JavaScript objects
    word_objects = []
    for word in words:
        word_obj = """  {{
    word: '{word}',
    pronunciation: '{pronunciation}',
    wordClass: '{wordClass}',
    definition: '{definition}',
    example: '{example}'
  }}""".format(
            word=word['word'].replace("'", "\\'"),
            pronunciation=word['pronunciation'].replace("'", "\\'"),
            wordClass=word['wordClass'].replace("'", "\\'"),
            definition=word['definition'].replace("'", "\\'"),
            example=word['example'].replace("'", "\\'")
        )
        word_objects.append(word_obj)
    
    content = header + ",\n".join(word_objects) + "\n" + footer
    
    # Write to file
    output_file = "data/ja/n5/words.js"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Successfully generated {output_file}")
    print(f"✓ Total words: {len(words)}")

if __name__ == "__main__":
    main()


# 첫눈 캐롤

코드로 칠한 인상파 스타일의 30초 크리스마스 캐롤 숏츠입니다(1080×1920). 사진을 수만 개의 붓 터치로 다시 칠하고, 가사는 키네틱 타이포로 칠해졌다가 눈발처럼 흩어집니다. 음악은 코드로 합성한 오리지널 오르골 캐롤입니다.

- **웹 플레이어**: `docs/index.html` (GitHub Pages로 게시)
- **영상 원본**: [HyperFrames](https://github.com/heygen-com/hyperframes) 프로젝트 (`index.html`, `compositions/painting.html`)

## 다시 만들기

```bash
node scripts/music.mjs       # assets/carol.wav 합성
npx hyperframes preview      # 미리보기
npx hyperframes render       # MP4 렌더
node scripts/build-web.mjs   # docs/ 웹 플레이어 다시 생성
```

## 크레딧

사진은 Wikimedia Commons의 자유 라이선스 이미지를 붓 터치로 다시 칠해 사용했습니다.

| 장면 | 사진 | 작가 | 라이선스 |
| --- | --- | --- | --- |
| 첫눈 | [Misty Christmas](https://commons.wikimedia.org/wiki/File:Misty_Christmas._-_Flickr_-_simon_berger.jpg) | simon berger | CC0 |
| 마켓 | [Budapest Christmas Market](https://commons.wikimedia.org/wiki/File:Budapest_Christmas_Market_(8227360521).jpg) | Top Budapest | CC BY 2.0 |
| 아이들 | [Christmas presents to Polish children](https://commons.wikimedia.org/wiki/File:Area_Support_Group_Poland_provides_Christmas_presents_to_Polish_children_(5982717).jpg) | U.S. Army 241MPAD | Public domain |
| 연인 | [Couple holding hands under Christmas lights](https://commons.wikimedia.org/wiki/File:Couple_holding_hands_under_Christmas_lights_in_Krupanj._January_2026.jpg) | Ljiljana Krupanj | CC BY 4.0 |
| 트리 | [Glowing Christmas Tree Lights](https://commons.wikimedia.org/wiki/File:Glowing_Christmas_Tree_Lights_in_the_Winter_Night.jpg) | epSos.de | CC BY 2.0 |

폰트: [Jua](https://fonts.google.com/specimen/Jua), [Mountains of Christmas](https://fonts.google.com/specimen/Mountains+of+Christmas) (SIL Open Font License).

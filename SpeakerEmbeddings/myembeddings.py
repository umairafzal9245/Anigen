# import os
# import torch

# from SpeakerEmbeddings.TTS.utils.managers import EmbeddingManager

# use_cuda = torch.cuda.is_available()

# model_path = "SpeakerEmbeddings/models/model_se.pth.tar"
# config_path = "SpeakerEmbeddings/models/config_se.json"

# encoder_manager = EmbeddingManager(
#     encoder_model_path=model_path,
#     encoder_config_path=config_path,
#     use_cuda=use_cuda,
# )

# print('hy')

# audio_file = "SpeakerEmbeddings/test.aac"
# embedd = encoder_manager.compute_embedding_from_clip(audio_file)
# embedd = embedd[0][256:512].reshape(1,256)